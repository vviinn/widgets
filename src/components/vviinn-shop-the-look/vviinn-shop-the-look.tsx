import {
  Component,
  Host,
  h,
  Prop,
  State,
  Event,
  EventEmitter,
  Element,
  Watch,
} from "@stencil/core";
import * as E from "fp-ts/lib/Either";
import { CropperManager } from "./cropper-manager";
import { Recommendation } from "../../interfaces";
import { Rectangle } from "../../interfaces/search";
import { BasicEventData } from "../../recommendation/events";
import { register } from "swiper/element";
import { updateGlobalState } from "../../store/store";
import {
  ModalPosition,
  setupIntersectionObserver,
  IntersectionObserverConfig,
  performVisualSearch,
  VisualSearchParams,
  handleDetectedObjectClick,
  DetectedObjectClickParams,
  isDesktop,
  shouldRenderDetectedObjects,
  getVisibilityThreshold,
  calculateImageBounds,
  calculateModalPosition,
} from "./helpers";
import { ShopTheLookImageStore, createDefaultImageState } from "./store";
import { TIMING } from "./constants";
import { shopTheLookState } from "../../store/search.store";
import {
  renderDetectedObjects,
  renderSwiper,
  renderModal,
  DetectedObjectsProps,
  SwiperProps,
  ModalProps,
} from "./render-helpers";
import { Locale } from "../../locale";
import { TEST_BASIC_EVENT_DATA } from "./test-data";
import { extractSlideIndex } from "../../utils/swiper/swiperUtils";

if (typeof window !== "undefined") {
  register();
}

export interface ShopTheLookEventData extends BasicEventData {
  detectedObjectId: string;
  product: Recommendation;
}

/**
 * Interactive "Shop the Look" widget that enables visual product search on fashion/interior images.
 * Users can click on hotspots (detected objects) to discover similar products and see recommendations in a modal.
 *
 * Supports multiple images with swiper navigation, responsive design, and customizable styling.
 */

@Component({
  tag: "vviinn-shop-the-look",
  styleUrl: "vviinn-shop-the-look.css",
  shadow: true,
})
export class VviinnShopTheLook {
  @Element() el: HTMLElement;

  /** Comma-separated list of image URLs to display in the widget */
  @Prop() imageUrls: string = "";
  /** Height of the widget in pixels */
  @Prop() height: number = 500;
  /** Vviinn customer's token (required) */
  @Prop() token: string = "";
  /** The currency sign is displayed after the price */
  @Prop() currencySign: string = "€";
  /** Campaign ID for visual search requests */
  @Prop() campaignId: string = "";
  /** The locale for currency formatting and text localization */
  @Prop() locale: Locale;
  /** Style variant for corner styling - 'rounded' for rounded corners, 'cornered' for sharp corners */
  @Prop() widgetStyle: "rounded" | "cornered" = "rounded";
  /** Enable cropper mode for manual area selection */
  @Prop() showCropper: boolean = false;
  /** @internal */
  @Prop() apiPath?: string;

  @State() selectedDetectedObject: Rectangle | null = null;
  @State() showModal: boolean = false;
  @State() modalPosition: ModalPosition | null = null;
  @State() showDetailedView: boolean = false;
  @State() selectedProductIndex: number = 0;
  @State() modalImageIndex: number = 0;

  @State() swiperActiveIndex: number = 0;
  @State() totalImages: number = 1;
  @State() imageUrlsList: string[] = [];
  @State() swiperKey: string = "swiper-0";
  @State() needNavigation: boolean = false;

  @State() showLoadingSpinner: boolean = false;
  @State() isSearchInProgress: boolean = false;

  @State() currentViewMode: "desktop" | "mobile" | null = null;
  @State() isWidgetVisible: boolean = false;

  /** Emitted when a detected object/hotspot is clicked. Contains the object ID and first recommended product. */
  @Event()
  vviinnShopTheLookDetectedObjectClick: EventEmitter<ShopTheLookEventData>;
  /** Emitted when a product in the recommendation modal is clicked. Contains the product details and detected object ID. */
  @Event() vviinnShopTheLookProductClick: EventEmitter<ShopTheLookEventData>;
  /** Emitted when the recommendation modal is closed by the user. */
  @Event() vviinnShopTheLookModalClose: EventEmitter<BasicEventData>;

  private imageElement: HTMLImageElement;
  private intersectionObserver: IntersectionObserver;
  private imageStore: ShopTheLookImageStore;
  private modalContentRef: HTMLElement;
  private cropperManager: CropperManager;
  private autoSelectTimeout?: number;
  private cropDebounceTimeout?: number;
  private isManualObjectSelection: boolean = false;

  componentWillLoad() {
    updateGlobalState({
      token: this.token,
      apiPath: this.apiPath,
      locale: this.locale,
      currencySign: this.currencySign,
    });

    if (this.imageUrls && this.imageUrls.trim()) {
      this.imageUrlsList = this.imageUrls
        .split(",")
        .map((url) => url.trim())
        .filter((url) => url.length > 0);
    }

    this.totalImages = this.imageUrlsList.length;

    this.currentViewMode = isDesktop() ? "desktop" : "mobile";
    this.updateNavigationVisibility();

    const isDesktopView = isDesktop();
    const threshold = getVisibilityThreshold(isDesktopView);

    this.imageStore = new ShopTheLookImageStore({
      threshold,
      token: this.token,
      isWidgetVisible: this.isWidgetVisible,
      totalImages: this.totalImages,
      isModalOpen: this.showModal,
      onVisualSearchTrigger: this.handleVisualSearchTrigger.bind(this),
    });

    if (this.showCropper) {
      this.cropperManager = new CropperManager({
        onCropEnd: (cropArea: Rectangle, imageIndex: number) => {
          this.debouncedCropSearch(cropArea, imageIndex);
        },
      });
    }
  }

  componentDidLoad() {
    window.addEventListener("resize", this.handleResize);
    document.addEventListener("click", this.handleDocumentClick);
    this.initializeContainerVisibilityTracking();
    this.setupSwiperEventListener();
    this.setupSwiperDragEventListeners();
  }

  @Watch("currentViewMode")
  onViewModeChange(newViewMode: "desktop" | "mobile" | null) {
    if (newViewMode) {
      requestAnimationFrame(() => {
        this.setupSwiperEventListener();
        this.setupSwiperDragEventListeners();
      });
    }
  }

  @Watch("showModal")
  onShowModalChange(newValue: boolean) {
    this.imageStore?.updateConfig({ isModalOpen: newValue });
  }

  private resetDetailedView = () => {
    this.showDetailedView = false;
    this.selectedProductIndex = 0;
  };

  private clearModalAndSlideState() {
    this.showModal = false;
    this.selectedDetectedObject = null;
    this.modalPosition = null;
    this.resetDetailedView();
    this.modalImageIndex = 0;

    if (this.autoSelectTimeout) {
      clearTimeout(this.autoSelectTimeout);
      this.autoSelectTimeout = undefined;
    }
  }

  private updateSearchingState(isCurrentImage: boolean = false) {
    this.showLoadingSpinner = this.imageStore?.hasActiveSearches() ?? false;
    if (isCurrentImage) {
      this.showLoadingSpinner = false;
    }
  }

  private getCurrentImageState() {
    return this.imageStore?.getImageState(this.swiperActiveIndex);
  }

  private isCurrentSlide(imageIndex: number): boolean {
    return imageIndex === this.swiperActiveIndex;
  }

  disconnectedCallback() {
    window.removeEventListener("resize", this.handleResize);
    document.removeEventListener("click", this.handleDocumentClick);
    this.intersectionObserver?.disconnect();
    this.imageStore?.disconnectAll();
    this.cropperManager?.destroyAll();
    if (this.autoSelectTimeout) clearTimeout(this.autoSelectTimeout);
    if (this.cropDebounceTimeout) clearTimeout(this.cropDebounceTimeout);

    const swiperContainer =
      this.el.shadowRoot?.querySelector("swiper-container");
    if (swiperContainer) {
      swiperContainer.removeEventListener(
        "swiperslidechange",
        this.handleSlideChange,
      );
      swiperContainer.removeEventListener(
        "swipersliderfirstmove",
        this.handleSwiperScroll,
      );
    }
  }

  private handleResize = () => {
    this.checkViewModeChange();
    this.updateNavigationVisibility();

    if (this.showCropper && this.cropperManager) {
      requestAnimationFrame(() => {
        this.cropperManager.updateCropperDimensions(
          this.swiperActiveIndex,
          (index) => this.imageStore.getImageElement(index),
        );
      });
    }
  };

  private handleDocumentClick = (event: Event) => {
    if (!this.showModal || this.showLoadingSpinner) return;

    const target = event.target as Element | null;
    if (!target) return;
    if (this.modalContentRef && this.modalContentRef.contains(target)) return;
    if (target.closest("vviinn-detected-object")) return;

    this.handleModalClose();
  };

  private checkViewModeChange = () => {
    const newViewMode = isDesktop() ? "desktop" : "mobile";
    if (newViewMode !== this.currentViewMode) {
      this.currentViewMode = newViewMode;

      if (this.showModal) this.handleModalClose();
      // Recreate swiper by changing key to apply new configuration
      this.swiperKey = `swiper-${Date.now()}`;
    }
  };

  private updateNavigationVisibility = () => {
    if (this.imageElement && this.imageElement.offsetWidth > 0) {
      const actualImageWidth = this.imageElement.offsetWidth + 20;
      const availableWidth = window.innerWidth - 100;
      const maxImagesVisible = Math.floor(availableWidth / actualImageWidth);
      this.needNavigation = this.totalImages > maxImagesVisible;
    } else {
      this.needNavigation = this.totalImages > 1;
    }
  };

  private initializeContainerVisibilityTracking() {
    const isDesktopView = isDesktop();
    const threshold = getVisibilityThreshold(isDesktopView);

    const config: IntersectionObserverConfig = {
      threshold,
      onIntersectionChange: (isWidgetVisible: boolean) => {
        const wasWidgetVisible = this.isWidgetVisible;
        this.isWidgetVisible = isWidgetVisible;

        this.imageStore?.updateConfig({
          isWidgetVisible: this.isWidgetVisible,
          isModalOpen: this.showModal,
        });

        if (!wasWidgetVisible && this.isWidgetVisible) {
          this.performVisualSearchIfReady();
        }
      },
    };

    this.intersectionObserver = setupIntersectionObserver(this.el, config);
  }

  private setupSwiperEventListener() {
    const swiperContainer =
      this.el.shadowRoot?.querySelector("swiper-container");

    if (swiperContainer) {
      setTimeout(() => {
        swiperContainer.addEventListener(
          "swiperslidechange",
          this.handleSlideChange,
        );
      }, TIMING.SWIPER_INIT_DELAY);
    }
  }

  private setupSwiperDragEventListeners() {
    const swiperContainer =
      this.el.shadowRoot?.querySelector("swiper-container");

    if (swiperContainer) {
      setTimeout(() => {
        swiperContainer.addEventListener(
          "swipersliderfirstmove",
          this.handleSwiperScroll,
          { passive: true },
        );
      }, TIMING.SWIPER_INIT_DELAY);
    }
  }

  private handleSwiperScroll = () => {
    if (this.showModal) {
      this.handleModalClose();
    }
  };

  private handleVisualSearchTrigger = (index: number) => {
    if (this.showModal) return;

    this.performVisualSearchForImage(index);
    this.updateSearchingState();
  };

  private setupObserverAfterSwiper(element: HTMLImageElement, index: number) {
    setTimeout(() => {
      const swiperContainer =
        this.el.shadowRoot?.querySelector("swiper-container");

      if (swiperContainer) {
        const setupObserver = () => {
          this.imageStore.setupImageIntersectionObserver(element, index);
        };
        const swiperInstance = swiperContainer?.swiper;

        if (swiperInstance) {
          setupObserver();
        } else {
          swiperContainer.addEventListener("swiperinit", setupObserver, {
            once: true,
          });

          // Fallback: if event doesn't fire, set up after delay
          setTimeout(() => {
            const state = this.imageStore.getImageState(index);
            if (!state?.observerSetup) {
              this.imageStore.setupImageIntersectionObserver(element, index);
            }
          }, 1000);
        }
      }
    }, TIMING.SWIPER_INIT_DELAY);
  }

  private performVisualSearchIfReady() {
    const isDesktopView = isDesktop();

    this.imageStore.updateConfig({
      isWidgetVisible: this.isWidgetVisible,
      token: this.token,
      totalImages: this.totalImages,
      isModalOpen: this.showModal,
    });

    if (this.token && this.isWidgetVisible) {
      const currentImageState = this.imageStore.getImageState(
        this.swiperActiveIndex,
      );

      if (currentImageState?.searchCompleted) {
        this.activateCurrentSlide();
      } else if (this.totalImages === 1 || !isDesktopView) {
        // Mark current image as visible for mobile/single image
        if (!isDesktopView || this.totalImages === 1) {
          this.markCurrentImageAsVisible();
        }

        // Only trigger if not already triggered
        const state = this.imageStore.getImageState(this.swiperActiveIndex);
        if (!state?.searchTriggered) {
          this.imageStore.updateImageState(this.swiperActiveIndex, {
            searchTriggered: true,
          });
          this.performVisualSearch(this.swiperActiveIndex);
        }
      }
    }
  }

  private markCurrentImageAsVisible() {
    const currentState = this.imageStore.getImageState(this.swiperActiveIndex);
    if (currentState) {
      currentState.isVisible = true;
      this.imageStore.setImageState(this.swiperActiveIndex, currentState);
    }
  }

  private navigateToSlide(slideIndex: number) {
    const swiperContainer =
      this.el.shadowRoot?.querySelector("swiper-container");
    if (swiperContainer && (swiperContainer as any).swiper) {
      (swiperContainer as any).swiper.slideTo(slideIndex);
    }
  }

  private forceSearchForSlide(slideIndex: number) {
    const imageState = this.imageStore.getImageState(slideIndex);
    if (imageState) {
      imageState.isVisible = true;
      this.imageStore.setImageState(slideIndex, imageState);
    }
    this.imageStore.updateImageState(slideIndex, { searchTriggered: true });
    this.performVisualSearch(slideIndex);
  }

  private ensureSlideSearchTriggered(slideIndex: number) {
    const imageState = this.imageStore.getImageState(slideIndex);

    if (!imageState.searchCompleted && !imageState.searchTriggered) {
      this.forceSearchForSlide(slideIndex);
    } else if (imageState.searchCompleted) {
      this.activateCurrentSlide();
    } else {
      this.performVisualSearchIfReady();
    }
  }

  private activateCurrentSlide() {
    this.markCurrentImageAsVisible();

    const imageState = this.imageStore.getImageState(this.swiperActiveIndex);
    if (imageState?.detectedObjects?.length > 0 && !this.showModal) {
      this.scheduleAutoSelectFirstObject(
        this.swiperActiveIndex,
        imageState.detectedObjects,
      );
    }
  }

  private handleDetectedObjectClick = async (
    detectedObject: Rectangle,
    objectIndex: number,
    imageIndex: number = this.swiperActiveIndex,
  ) => {
    if (!this.token) return;

    const needsSlideTransition =
      isDesktop() && !this.isCurrentSlide(imageIndex);

    if (needsSlideTransition) {
      this.isManualObjectSelection = true;
      this.selectedDetectedObject = null;
      this.swiperActiveIndex = imageIndex;
      this.navigateToSlide(imageIndex);
      await new Promise((resolve) =>
        setTimeout(() => requestAnimationFrame(() => requestAnimationFrame(resolve)), 200)
      );
    }

    if (this.showCropper) {
      const hasCropperForSlide = this.cropperManager?.hasCropper?.(imageIndex);
      if (!hasCropperForSlide) {
        this.activateCropperForSlide(imageIndex);
      }
    }

    this.selectedDetectedObject = detectedObject;
    this.isManualObjectSelection = false;
    this.showLoadingSpinner = true;
    this.showModal = false;
    this.resetDetailedView();
    this.modalImageIndex = imageIndex;

    const imageBounds = this.getImageBounds(imageIndex);
    const imageElement =
      this.imageStore.getImageElement(imageIndex) || this.imageElement;

    if (imageBounds && imageElement) {
      this.modalPosition = calculateModalPosition(
        imageElement,
        detectedObject,
        this.el,
        imageBounds,
      );
    }

    const imageState = this.imageStore.getImageState(imageIndex);
    const visualSearchId =
      imageState?.visualSearchId || shopTheLookState.visualSearchId || null;

    const params: DetectedObjectClickParams = {
      detectedObject,
      imageElement,
      containerElement: this.el,
      token: this.token,
      visualSearchId,
      campaignId: this.campaignId,
      imageBounds,
      isSearchInProgress: this.isSearchInProgress,
      setSearchInProgress: (inProgress: boolean) => {
        this.isSearchInProgress = inProgress;
      },
    };

    const result = await handleDetectedObjectClick(params);

    E.fold(
      (error: string) => {
        if (error.includes("Search already in progress")) {
          return;
        }
        console.error("Visual search failed:", error);
        this.showLoadingSpinner = false;
      },
      (response: {
        searchResults: Recommendation[];
        modalPosition: ModalPosition;
      }) => {
        if (response.searchResults && response.searchResults.length > 0) {
          this.imageStore.updateImageState(imageIndex, {
            searchResults: response.searchResults,
          });
        }

        this.showLoadingSpinner = false;

        if (
          response.searchResults &&
          response.searchResults.length > 0 &&
          this.isCurrentSlide(imageIndex)
        ) {
          this.showModal = true;
        }

        this.vviinnShopTheLookDetectedObjectClick.emit({
          ...TEST_BASIC_EVENT_DATA,
          detectedObjectId: `detected-${imageIndex}-${objectIndex}`,
          product: response.searchResults[0] || null,
        });
      },
    )(result);
  };

  private performVisualSearch = async (
    targetImageIndex: number = this.swiperActiveIndex,
  ) => {
    const targetImageUrl = this.imageUrlsList[targetImageIndex];
    if (!this.token || !targetImageUrl) return;

    const isCurrentImage = targetImageIndex === this.swiperActiveIndex;
    if (isCurrentImage) this.showLoadingSpinner = true;

    const params: VisualSearchParams = {
      imageUrl: targetImageUrl,
      token: this.token,
      campaignId: this.campaignId,
    };

    const result = await performVisualSearch(params);

    E.fold(
      (error: string) => {
        console.error(
          `Visual search failed for image ${targetImageIndex}:`,
          error,
        );
        this.imageStore.updateImageState(targetImageIndex, {
          searchCompleted: true,
        });
        if (isCurrentImage) {
          this.showLoadingSpinner = false;
        }
      },
      (response: {
        detectedObjects: Rectangle[];
        searchResults: Recommendation[];
        visualSearchId?: string;
      }) => {
        this.imageStore.updateImageStateData(
          targetImageIndex,
          response.detectedObjects,
          true,
          response.searchResults,
          response.visualSearchId || null,
        );

        const targetImageState =
          this.imageStore.getImageState(targetImageIndex);

        if (isCurrentImage) {
          this.showLoadingSpinner = false;
        }

        const shouldAutoClick =
          targetImageState.detectedObjects.length > 0 &&
          isCurrentImage &&
          targetImageIndex === this.swiperActiveIndex &&
          !this.showModal;

        if (shouldAutoClick) {
          this.scheduleAutoSelectFirstObject(
            targetImageIndex,
            targetImageState.detectedObjects,
          );
        }

        this.imageStore.updateImageState(targetImageIndex, {
          searchCompleted: true,
        });
      },
    )(result);
  };

  private handleProductClick = (product: Recommendation) => {
    this.vviinnShopTheLookProductClick.emit({
      ...TEST_BASIC_EVENT_DATA,
      detectedObjectId: this.selectedDetectedObject
        ? `detected-${Date.now()}`
        : "",
      product,
    });
  };

  private getCropperBounds(imageIndex: number): Rectangle | null {
    if (
      this.showCropper &&
      this.cropperManager?.hasCropper &&
      this.cropperManager.hasCropper(imageIndex)
    ) {
      const cropperImage = this.el.shadowRoot?.querySelector(
        ".cropper-container .cropper-canvas img",
      ) as HTMLImageElement;
      if (cropperImage && cropperImage.offsetWidth > 0) {
        return calculateImageBounds(cropperImage);
      }
    }
    return null;
  }

  private getStoreBounds(imageIndex: number): Rectangle | null {
    const imageElement = this.imageStore.getImageElement(imageIndex);
    if (imageElement && imageElement.offsetWidth > 0) {
      return calculateImageBounds(imageElement);
    }
    return null;
  }

  private getVisibleSlideBounds(imageIndex: number): Rectangle | null {
    // Filter out cropper images and hidden elements
    const slideImages = Array.from(
      this.el.shadowRoot?.querySelectorAll("swiper-slide img") || [],
    ).filter(
      (img) =>
        !img.closest(".cropper-container") &&
        (img as HTMLImageElement).offsetWidth > 0,
    );

    if (slideImages && slideImages[imageIndex]) {
      return calculateImageBounds(slideImages[imageIndex] as HTMLImageElement);
    }
    return null;
  }

  private getImageBounds(imageIndex: number): Rectangle | null {
    return (
      this.getCropperBounds(imageIndex) ||
      this.getStoreBounds(imageIndex) ||
      this.getVisibleSlideBounds(imageIndex)
    );
  }

  private activateCropperForSlide = (activeIndex: number) => {
    this.cropperManager?.activateCropperForSlide(activeIndex, (index) =>
      this.imageStore.getImageElement(index),
    );
  };

  private debouncedCropSearch = (cropArea: Rectangle, imageIndex: number) => {
    if (this.cropDebounceTimeout) {
      clearTimeout(this.cropDebounceTimeout);
    }

    this.cropDebounceTimeout = window.setTimeout(() => {
      this.cropDebounceTimeout = undefined;
      this.handleDetectedObjectClick(cropArea, 0, imageIndex);
    }, TIMING.CROP_DEBOUNCE_DELAY);
  };

  private handleModalClose = (event?: Event) => {
    if (this.showLoadingSpinner) return;
    if (event && event.target !== event.currentTarget) return;

    this.clearModalAndSlideState();
    this.vviinnShopTheLookModalClose.emit(TEST_BASIC_EVENT_DATA);
  };

  private handleProductDetailsClick = (
    _product: Recommendation,
    index: number,
  ) => {
    this.selectedProductIndex = index;
    this.showDetailedView = true;
  };

  private handleNavigateProduct = (direction: "prev" | "next") => {
    const modalImageState = this.imageStore.getImageState(this.modalImageIndex);
    if (direction === "prev" && this.selectedProductIndex > 0) {
      this.selectedProductIndex--;
    } else if (
      direction === "next" &&
      this.selectedProductIndex < modalImageState.searchResults.length - 1
    ) {
      this.selectedProductIndex++;
    }
  };

  private renderDetectedObjectsWrapper = (imageIndex: number) => {
    const imageState = this.imageStore.getImageState(imageIndex);
    const isActiveSlide = this.isCurrentSlide(imageIndex);

    if (!shouldRenderDetectedObjects(imageState, isActiveSlide)) {
      return null;
    }

    const imageBounds = this.getImageBounds(imageIndex);

    const props: DetectedObjectsProps = {
      imageBounds,
      detectedObjects: imageState.detectedObjects,
      initialSearchCompleted: imageState.searchCompleted,
      selectedDetectedObject: this.selectedDetectedObject,
      basicEventData: TEST_BASIC_EVENT_DATA,
      onSelectObject: (detectedObject: Rectangle, objectIndex: number) =>
        this.handleDetectedObjectClick(detectedObject, objectIndex, imageIndex),
    };
    return renderDetectedObjects(props);
  };

  private handleSlideChange = (event: any) => {
    const newIndex = extractSlideIndex(event);

    if (newIndex !== undefined) {
      if (newIndex !== this.swiperActiveIndex) {
        this.swiperActiveIndex = newIndex;
      }

      this.clearModalAndSlideState();

      setTimeout(() => {
        this.ensureSlideSearchTriggered(this.swiperActiveIndex);
      }, TIMING.SLIDE_TRANSITION_DELAY);
    }
  };

  private handleImageRef = (el: HTMLImageElement, index: number) => {
    const state = this.imageStore.getImageState(index);
    if (state?.refProcessed && this.imageStore.getImageElement(index) === el) {
      return;
    }

    this.imageStore.updateImageState(index, { refProcessed: true });

    if (index === this.swiperActiveIndex || this.totalImages <= 1) {
      this.imageElement = el;
    }

    if (el) {
      this.imageStore.setImageElement(index, el);

      // Initialize image state only if it doesn't exist
      if (!this.imageStore.hasImageState(index)) {
        const currentState = createDefaultImageState(el);
        this.imageStore.setImageState(index, currentState);
        this.imageStore.setImageState(index, currentState);
      } else {
        // Just update the imageElement reference without triggering re-render
        const existingState = this.imageStore.getImageState(index);
        existingState.imageElement = el;
        this.imageStore.setImageState(index, existingState);
      }

      const isDesktopView = isDesktop();
      if (isDesktopView) {
        this.setupObserverAfterSwiper(el, index);
      }

      if (el.complete && el.offsetWidth > 0) {
        this.initializeImageForCropper(el, index);
      } else {
        el.addEventListener(
          "load",
          () => {
            this.initializeImageForCropper(el, index);
          },
          { once: true },
        );
      }
    }
  };

  private updateImageBoundsForElement = (
    _el: HTMLImageElement,
    index: number,
  ) => {
    requestAnimationFrame(() => {
      if (index === this.swiperActiveIndex || this.totalImages <= 1) {
        this.updateNavigationVisibility();
      }
    });
  };

  private initializeImageForCropper = (el: HTMLImageElement, index: number) => {
    this.updateImageBoundsForElement(el, index);
    this.cropperManager?.initializeCropper(el, index, this.swiperActiveIndex);
  };

  private performVisualSearchForImage = async (imageIndex: number) => {
    const imageUrl = this.imageUrlsList[imageIndex];

    if (!this.token || !imageUrl) return;

    const isCurrentImage = this.isCurrentSlide(imageIndex);

    if (isCurrentImage) {
      this.showLoadingSpinner = true;
    }

    const params: VisualSearchParams = {
      imageUrl,
      token: this.token,
      campaignId: this.campaignId,
    };

    const result = await performVisualSearch(params);

    E.fold(
      (error: string) => {
        console.error(`Visual search failed for image ${imageIndex}:`, error);
        this.imageStore.updateImageStateData(imageIndex, [], true, [], null);
        this.updateSearchingState(isCurrentImage);
      },
      (response: {
        detectedObjects: Rectangle[];
        searchResults: Recommendation[];
        visualSearchId?: string;
      }) => {
        this.imageStore.updateImageStateData(
          imageIndex,
          response.detectedObjects,
          true,
          response.searchResults,
          response.visualSearchId || null,
        );
        this.updateSearchingState(isCurrentImage);

        const shouldAutoClick =
          response.detectedObjects.length > 0 &&
          this.isCurrentSlide(imageIndex) &&
          !this.showModal &&
          !this.isManualObjectSelection;

        if (shouldAutoClick) {
          this.scheduleAutoSelectFirstObject(
            imageIndex,
            response.detectedObjects,
          );
        }
      },
    )(result);
  };

  private scheduleAutoSelectFirstObject(
    imageIndex: number,
    detectedObjects: Rectangle[],
  ) {
    if (
      !detectedObjects?.length ||
      !this.isCurrentSlide(imageIndex) ||
      this.autoSelectTimeout ||
      this.isManualObjectSelection
    ) {
      return;
    }

    this.autoSelectTimeout = window.setTimeout(() => {
      this.autoSelectTimeout = undefined;
      if (!this.isCurrentSlide(imageIndex) || this.showModal) return;

      const first = detectedObjects[0];
      if (first) {
        this.handleDetectedObjectClick(first, 0, imageIndex);
      }
    }, TIMING.SEARCH_DEBOUNCE_DELAY);
  }

  private handleNavigatePrev = () => {
    if (this.swiperActiveIndex > 0) {
      const newIndex = this.swiperActiveIndex - 1;
      this.updateSlideIndex(newIndex);
    }
  };

  private handleNavigateNext = () => {
    if (this.swiperActiveIndex < this.totalImages - 1) {
      const newIndex = this.swiperActiveIndex + 1;
      this.updateSlideIndex(newIndex);
    }
  };

  private updateSlideIndex = (newIndex: number) => {
    this.swiperActiveIndex = newIndex;
    this.navigateToSlide(newIndex);
    this.clearModalAndSlideState();

    setTimeout(() => {
      const imageState = this.imageStore.getImageState(newIndex);

      if (!imageState.searchCompleted && !imageState.searchTriggered) {
        this.forceSearchForSlide(newIndex);
      } else {
        this.performVisualSearchIfReady();
      }

      if (this.showCropper) {
        this.activateCropperForSlide(newIndex);
      }
    }, TIMING.SLIDE_TRANSITION_DELAY);
  };

  private renderSwiperWrapper = () => {
    const props: SwiperProps = {
      totalImages: this.totalImages,
      imageUrls: this.imageUrlsList,
      swiperActiveIndex: this.swiperActiveIndex,
      height: this.height,
      imageElement: this.imageElement,
      detectedObjects: this.getCurrentImageState().detectedObjects,
      onSlideChange: this.handleSlideChange,
      onImageRef: this.handleImageRef,
      renderDetectedObjects: this.renderDetectedObjectsWrapper,
      onNavigatePrev: this.handleNavigatePrev,
      onNavigateNext: this.handleNavigateNext,
      swiperKey: this.swiperKey,
      allowTouchMove: !this.showCropper || isDesktop(),
      showNavigation: (this.needNavigation && isDesktop()) || this.showCropper,
    };
    return renderSwiper(props);
  };

  private renderModalWrapper = () => {
    const props: ModalProps = {
      showModal: this.showModal,
      selectedDetectedObject: this.selectedDetectedObject,
      modalPosition: this.modalPosition,
      searchResults: this.imageStore.getImageState(this.modalImageIndex)
        .searchResults,
      onProductClick: this.handleProductClick,
      showDetailedView: this.showDetailedView,
      selectedProductIndex: this.selectedProductIndex,
      onProductDetailsClick: this.handleProductDetailsClick,
      onBackToGrid: this.resetDetailedView,
      onNavigateProduct: this.handleNavigateProduct,
      currencySign: this.currencySign,
      modalContentRef: (el: HTMLElement) => {
        this.modalContentRef = el;
      },
    };
    return renderModal(props);
  };

  render() {
    return (
      <Host>
        <div
          class={`shop-the-look-container ${this.showModal ? "modal-open" : ""} ${this.showCropper ? "with-cropper" : ""} widget-style-${this.widgetStyle}`}
        >
          <div class="main-content">
            {this.renderSwiperWrapper()}
            {this.showLoadingSpinner && (
              <div class="search-loader">
                <vviinn-preloader />
              </div>
            )}
          </div>
          {this.renderModalWrapper()}
        </div>
      </Host>
    );
  }
}
