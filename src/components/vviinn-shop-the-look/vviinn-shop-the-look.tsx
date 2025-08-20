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
import { Recommendation } from "../../interfaces";
import { Rectangle } from "../../interfaces/search";
import { BasicEventData } from "../../recommendation/events";
import { register } from "swiper/element";
import { updateGlobalState } from "../../store/store";
import {
  calculateImageBounds,
  ModalPosition,
  setupIntersectionObserver,
  IntersectionObserverConfig,
  performVisualSearch,
  VisualSearchParams,
  handleDetectedObjectClick,
  DetectedObjectClickParams,
  extractSlideIndex,
  isDesktop,
  shouldRenderDetectedObjects,
  getVisibilityThreshold,
} from "./helpers";
import { ShopTheLookImageStore, createDefaultImageState } from "./store";
import { TIMING } from "./constants";
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
  /** @internal */
  @Prop() apiPath?: string;

  @State() selectedDetectedObject: Rectangle | null = null;
  @State() showModal: boolean = false;
  @State() currentResultIndex: number = 0;
  @State() modalPosition: ModalPosition | null = null;
  @State() isSearching: boolean = false;
  @State() componentToken: string | null = null;
  @State() isIntersecting: boolean = false;
  @State() currentImageIndex: number = 0;
  @State() totalImages: number = 1;
  @State() imageUrlsList: string[] = [];
  @State() showSliderView: boolean = false;
  @State() currentProductIndex: number = 0;
  @State() currentViewMode: "desktop" | "mobile" | null = null;
  @State() swiperKey: string = "swiper-0";
  @State() showArrows: boolean = false;

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
    if (this.token) {
      this.componentToken = this.token;
    }

    this.currentViewMode = isDesktop() ? "desktop" : "mobile";
    this.updateArrowsVisibility();

    const isDesktopView = isDesktop();
    const threshold = getVisibilityThreshold(isDesktopView);

    this.imageStore = new ShopTheLookImageStore({
      threshold,
      token: this.token,
      isIntersecting: this.isIntersecting,
      totalImages: this.totalImages,
      onImageVisibilityChange: this.handleImageVisibilityChange.bind(this),
      onVisualSearchTrigger: this.handleVisualSearchTrigger.bind(this),
    });
  }

  componentDidLoad() {
    this.imageElement?.addEventListener("load", () => {
      this.updateImageBounds();
      this.updateArrowsVisibility();
    });
    window.addEventListener("resize", this.handleResize);
    this.initializeContainerVisibilityTracking();
    this.setupSwiperEventListener();
  }

  @Watch("currentViewMode")
  onViewModeChange(newViewMode: "desktop" | "mobile" | null) {
    if (newViewMode && this.totalImages > 1) {
      if (this.showModal) {
        this.handleModalClose();
      }

      setTimeout(() => {
        this.setupSwiperEventListener();
      }, 100);
    }
  }

  @State() private rerenderTrigger: number = 0;

  private triggerReRender() {
    this.rerenderTrigger++;
  }

  private clearModalAndSlideState() {
    this.showModal = false;
    this.selectedDetectedObject = null;
    this.modalPosition = null;
    this.currentResultIndex = 0;
  }

  private updateSearchingState(isCurrentImage: boolean = false) {
    this.isSearching = this.imageStore.hasActiveSearches();
    if (isCurrentImage) {
      this.isSearching = false;
    }
    this.triggerReRender();
  }

  private getCurrentImageState() {
    return this.imageStore.getImageState(this.currentImageIndex);
  }

  disconnectedCallback() {
    this.imageElement?.removeEventListener("load", () =>
      this.updateImageBounds(),
    );
    window.removeEventListener("resize", this.handleResize);
    this.intersectionObserver?.disconnect();
    this.imageStore?.disconnectAll();

    const swiperContainer =
      this.el.shadowRoot?.querySelector("swiper-container");
    if (swiperContainer) {
      swiperContainer.removeEventListener(
        "swiperslidechange",
        this.handleSlideChange,
      );
      swiperContainer.removeEventListener(
        "slidechange",
        this.handleSlideChange,
      );
    }
  }

  private handleResize = () => {
    this.updateImageBounds();
    this.checkViewModeChange();
    this.updateArrowsVisibility();
    this.triggerReRender();
  };

  private checkViewModeChange = () => {
    const newViewMode = isDesktop() ? "desktop" : "mobile";
    if (newViewMode !== this.currentViewMode) {
      this.currentViewMode = newViewMode;
      // Recreate swiper by changing key
      this.swiperKey = `swiper-${Date.now()}`;
    }
  };

  private updateArrowsVisibility = () => {
    const isDesktopView = isDesktop();
    if (!isDesktopView) {
      this.showArrows = false;
      return;
    }

    if (this.imageElement && this.imageElement.offsetWidth > 0) {
      const actualImageWidth = this.imageElement.offsetWidth + 20;
      const availableWidth = window.innerWidth - 100;
      const maxImagesVisible = Math.floor(availableWidth / actualImageWidth);
      this.showArrows = this.totalImages > maxImagesVisible;
    } else {
      this.showArrows = this.totalImages > 1;
    }
  };

  private updateImageBounds() {
    if (
      this.imageElement &&
      this.imageElement.offsetWidth > 0 &&
      this.imageElement.offsetHeight > 0
    ) {
      const newBounds = calculateImageBounds(this.imageElement);
      if (newBounds) {
        this.imageStore.updateImageState(this.currentImageIndex, {
          imageBounds: newBounds,
        });
      }
    }
  }

  private initializeContainerVisibilityTracking() {
    const isDesktopView = isDesktop();
    const threshold = getVisibilityThreshold(isDesktopView);

    const config: IntersectionObserverConfig = {
      threshold,
      onIntersectionChange: (isIntersecting: boolean) => {
        const wasIntersecting = this.isIntersecting;
        this.isIntersecting = isIntersecting;

        this.imageStore?.updateConfig({
          isIntersecting: this.isIntersecting,
        });

        if (!wasIntersecting && this.isIntersecting) {
          this.performVisualSearchIfReady();
        }
      },
    };

    this.intersectionObserver = setupIntersectionObserver(this.el, config);
  }

  private setupSwiperEventListener() {
    setTimeout(() => {
      const swiperContainer =
        this.el.shadowRoot?.querySelector("swiper-container");
      if (swiperContainer) {
        swiperContainer.addEventListener(
          "swiperslidechange",
          this.handleSlideChange,
        );
        swiperContainer.addEventListener("slidechange", this.handleSlideChange);
      }
    }, TIMING.SWIPER_INIT_DELAY);
  }

  private handleImageVisibilityChange = () => {
    this.triggerReRender();
  };

  private handleVisualSearchTrigger = (index: number) => {
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
      isIntersecting: this.isIntersecting,
      token: this.token,
      totalImages: this.totalImages,
    });

    if (this.token && this.isIntersecting) {
      const currentImageState = this.imageStore.getImageState(
        this.currentImageIndex,
      );

      if (currentImageState?.searchCompleted) {
        this.loadImageState();
      } else if (this.totalImages === 1 || !isDesktopView) {
        // Mark current image as visible for mobile/single image
        if (!isDesktopView || this.totalImages === 1) {
          this.markCurrentImageAsVisible();
        }

        // Only trigger if not already triggered
        const state = this.imageStore.getImageState(this.currentImageIndex);
        if (!state?.searchTriggered) {
          this.imageStore.updateImageState(this.currentImageIndex, {
            searchTriggered: true,
          });
          this.performVisualSearch();
        }
      }
    }
  }

  private markCurrentImageAsVisible() {
    const currentState = this.imageStore.getImageState(this.currentImageIndex);
    if (currentState) {
      currentState.isVisible = true;
      this.imageStore.setImageState(this.currentImageIndex, currentState);
    }
  }

  private loadImageState() {
    const isDesktopView = isDesktop();
    if (!isDesktopView || this.totalImages === 1) {
      this.markCurrentImageAsVisible();
    }
  }

  private handleDetectedObjectClick = async (
    detectedObject: Rectangle,
    objectIndex: number,
    imageIndex: number = this.currentImageIndex,
  ) => {
    if (!this.token) return;

    this.selectedDetectedObject = detectedObject;
    this.isSearching = true;
    this.showModal = false;
    this.currentResultIndex = 0;

    const imageElement =
      this.imageStore.getImageElement(imageIndex) || this.imageElement;

    const imageState = this.imageStore.getImageState(imageIndex);
    const visualSearchId = imageState?.visualSearchId || null;

    const params: DetectedObjectClickParams = {
      detectedObject,
      imageElement,
      token: this.token,
      componentToken: this.componentToken,
      containerElement: this.el,
      visualSearchId,
      campaignId: this.campaignId,
    };

    const result = await handleDetectedObjectClick(params);

    E.fold(
      (error: string) => {
        if (error.includes("Search already in progress")) {
          return;
        }
        console.error("Visual search failed:", error);
        this.isSearching = false;
      },
      (response: {
        searchResults: Recommendation[];
        modalPosition: ModalPosition;
      }) => {
        if (response.searchResults && response.searchResults.length > 0) {
          this.imageStore.updateImageState(this.currentImageIndex, {
            searchResults: response.searchResults,
          });
        }

        this.modalPosition = response.modalPosition;
        this.currentResultIndex = 0;
        this.isSearching = false;

        if (response.searchResults && response.searchResults.length > 0) {
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

  private performVisualSearch = async () => {
    const currentImageUrl = this.imageUrlsList[this.currentImageIndex];
    if (!this.token || !currentImageUrl) return;

    this.isSearching = true;

    const params: VisualSearchParams = {
      imageUrl: currentImageUrl,
      token: this.token,
      componentToken: this.componentToken,
      campaignId: this.campaignId,
    };

    const result = await performVisualSearch(params);

    E.fold(
      (error: string) => {
        console.error("Visual search failed:", error);
        this.imageStore.updateImageState(this.currentImageIndex, {
          searchCompleted: true,
        });
        this.isSearching = false;
      },
      (response: {
        detectedObjects: Rectangle[];
        searchResults: Recommendation[];
        visualSearchId?: string;
      }) => {
        this.imageStore.updateImageStateData(
          this.currentImageIndex,
          response.detectedObjects,
          true,
          response.searchResults,
          response.visualSearchId || null,
        );

        const currentImageState = this.getCurrentImageState();
        if (currentImageState.detectedObjects.length > 0) {
          this.isSearching = false;
          setTimeout(async () => {
            await this.handleDetectedObjectClick(
              currentImageState.detectedObjects[0],
              0,
            );
            this.imageStore.updateImageState(this.currentImageIndex, {
              searchCompleted: true,
            });
          }, TIMING.SEARCH_DELAY);
        } else {
          this.imageStore.updateImageState(this.currentImageIndex, {
            searchCompleted: true,
          });
          this.isSearching = false;
        }
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

  private handleModalClose = (event?: Event) => {
    if (this.isSearching) return;
    if (event && event.target !== event.currentTarget) return;

    this.clearModalAndSlideState();
    this.showSliderView = false;
    this.currentProductIndex = 0;
    this.vviinnShopTheLookModalClose.emit(TEST_BASIC_EVENT_DATA);
  };

  private handleProductDetailsClick = (
    _product: Recommendation,
    index: number,
  ) => {
    this.currentProductIndex = index;
    this.showSliderView = true;
  };

  private handleBackToGrid = () => {
    this.showSliderView = false;
    this.currentProductIndex = 0;
  };

  private handleNavigateProduct = (direction: "prev" | "next") => {
    if (direction === "prev" && this.currentProductIndex > 0) {
      this.currentProductIndex--;
    } else if (
      direction === "next" &&
      this.currentProductIndex <
        this.getCurrentImageState().searchResults.length - 1
    ) {
      this.currentProductIndex++;
    }
  };

  private renderDetectedObjectsWrapper = (imageIndex: number) => {
    const imageState = this.imageStore.getImageState(imageIndex);

    if (!shouldRenderDetectedObjects(imageState)) {
      return null;
    }

    const imageBounds = imageState.imageBounds;

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

    if (newIndex !== null && newIndex !== this.currentImageIndex) {
      this.currentImageIndex = newIndex;
      this.clearModalAndSlideState();

      setTimeout(() => {
        this.updateImageBounds();

        const isDesktopView = isDesktop();
        if (!isDesktopView) {
          this.markCurrentImageAsVisible();
          this.performVisualSearchIfReady();
        } else {
          const currentImageState = this.imageStore.getImageState(
            this.currentImageIndex,
          );
          if (currentImageState?.searchCompleted) {
            this.loadImageState();
          }
        }
      }, TIMING.SLIDE_TRANSITION_DELAY);
    }
  };

  private handleImageRef = (el: HTMLImageElement, index: number) => {
    const state = this.imageStore.getImageState(index);
    if (state?.refProcessed && this.imageStore.getImageElement(index) === el) {
      return;
    }

    this.imageStore.updateImageState(index, { refProcessed: true });

    if (index === this.currentImageIndex || this.totalImages <= 1) {
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
        this.updateImageBoundsForElement(el, index);
      } else {
        el.addEventListener(
          "load",
          () => this.updateImageBoundsForElement(el, index),
          { once: true },
        );
      }
    }
  };

  private updateImageBoundsForElement = (
    el: HTMLImageElement,
    index: number,
  ) => {
    requestAnimationFrame(() => {
      if (index === this.currentImageIndex || this.totalImages <= 1) {
        this.updateImageBounds();
        this.updateArrowsVisibility();
      }

      const imageState = this.imageStore.getImageState(index);
      if (imageState) {
        const bounds = calculateImageBounds(el);
        if (bounds) {
          imageState.imageBounds = bounds;
          this.imageStore.setImageState(index, imageState);
          this.triggerReRender();
        }
      }
    });
  };

  private performVisualSearchForImage = async (imageIndex: number) => {
    const imageUrl = this.imageUrlsList[imageIndex];
    if (!this.token || !imageUrl) return;

    const isCurrentImage = imageIndex === this.currentImageIndex;

    if (isCurrentImage) {
      this.isSearching = true;
    }

    const params: VisualSearchParams = {
      imageUrl,
      token: this.token,
      componentToken: this.componentToken,
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

        if (imageIndex === 0 && response.detectedObjects.length > 0) {
          setTimeout(async () => {
            await this.handleDetectedObjectClick(
              response.detectedObjects[0],
              0,
              imageIndex,
            );
          }, TIMING.SEARCH_DELAY);
        }
      },
    )(result);
  };

  private handleNavigatePrev = () => {
    if (this.currentImageIndex > 0) {
      const newIndex = this.currentImageIndex - 1;
      this.updateSlideIndex(newIndex);

      const swiperContainer =
        this.el.shadowRoot?.querySelector("swiper-container");
      if (swiperContainer && (swiperContainer as any).swiper) {
        (swiperContainer as any).swiper.slideTo(newIndex);
      }
    }
  };

  private handleNavigateNext = () => {
    if (this.currentImageIndex < this.totalImages - 1) {
      const newIndex = this.currentImageIndex + 1;
      this.updateSlideIndex(newIndex);

      const swiperContainer =
        this.el.shadowRoot?.querySelector("swiper-container");
      if (swiperContainer && (swiperContainer as any).swiper) {
        (swiperContainer as any).swiper.slideTo(newIndex);
      }
    }
  };

  private updateSlideIndex = (newIndex: number) => {
    this.currentImageIndex = newIndex;
    this.clearModalAndSlideState();

    setTimeout(() => {
      this.updateImageBounds();
      this.performVisualSearchIfReady();
    }, TIMING.SLIDE_TRANSITION_DELAY);
  };

  private renderSwiperWrapper = () => {
    const props: SwiperProps = {
      totalImages: this.totalImages,
      imageUrls: this.imageUrlsList,
      currentImageIndex: this.currentImageIndex,
      height: this.height,
      imageElement: this.imageElement,
      detectedObjects: this.getCurrentImageState().detectedObjects,
      onSlideChange: this.handleSlideChange,
      onImageRef: this.handleImageRef,
      renderDetectedObjects: this.renderDetectedObjectsWrapper,
      onNavigatePrev: this.handleNavigatePrev,
      onNavigateNext: this.handleNavigateNext,
      shouldShowArrows: this.showArrows,
      swiperKey: this.swiperKey,
    };
    return renderSwiper(props);
  };

  private renderModalWrapper = () => {
    const props: ModalProps = {
      showModal: this.showModal,
      selectedDetectedObject: this.selectedDetectedObject,
      modalPosition: this.modalPosition,
      searchResults: this.getCurrentImageState().searchResults,
      onModalClose: this.handleModalClose,
      onProductClick: this.handleProductClick,
      showSliderView: this.showSliderView,
      currentProductIndex: this.currentProductIndex,
      onProductDetailsClick: this.handleProductDetailsClick,
      onBackToGrid: this.handleBackToGrid,
      onNavigateProduct: this.handleNavigateProduct,
      currencySign: this.currencySign,
    };
    return renderModal(props);
  };

  render() {
    return (
      <Host>
        <div
          class={`shop-the-look-container ${this.showModal ? "modal-open" : ""}`}
        >
          <div class="main-content">
            {this.renderSwiperWrapper()}
            {this.isSearching && (
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
