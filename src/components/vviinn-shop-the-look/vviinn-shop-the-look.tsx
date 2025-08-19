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
  getVisibilityThreshold,
  shouldRenderDetectedObjects,
} from "./helpers";
import { INTERSECTION_THRESHOLDS, TIMING } from "./constants";
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
  @State() imageBounds: Rectangle | null = null;
  @State() detectedObjects: Rectangle[] = [];
  @State() searchResults: Recommendation[] = [];
  @State() currentResultIndex: number = 0;
  @State() modalPosition: ModalPosition | null = null;
  @State() isSearching: boolean = false;
  @State() componentToken: string | null = null;
  @State() initialSearchCompleted: boolean = false;
  @State() isIntersecting: boolean = false;
  @State() imageStates: Map<
    number,
    {
      detectedObjects: Rectangle[];
      searchCompleted: boolean;
      searchResults: Recommendation[];
      isVisible: boolean;
      imageElement: HTMLImageElement | null;
      imageBounds: Rectangle | null;
      visualSearchId: string | null;
    }
  > = new Map();
  @State() visibleImageIndices: Set<number> = new Set();
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
  private imageObservers: Map<number, IntersectionObserver> = new Map();
  private imageElements: Map<number, HTMLImageElement> = new Map();

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

    this.imageBounds = {
      left: 0,
      top: 0,
      width: 0, // Will be calculated from image aspect ratio
      height: this.height,
    };
    this.totalImages = this.imageUrlsList.length;
    if (this.token) {
      this.componentToken = this.token;
    }

    this.currentViewMode = isDesktop() ? "desktop" : "mobile";
    this.updateArrowsVisibility();
  }

  componentDidLoad() {
    this.imageElement?.addEventListener("load", () => {
      this.updateImageBounds();
      this.updateArrowsVisibility();
    });
    window.addEventListener("resize", this.handleResize);
    this.setupIntersectionObserver();
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

  disconnectedCallback() {
    this.imageElement?.removeEventListener("load", () =>
      this.updateImageBounds(),
    );
    window.removeEventListener("resize", this.handleResize);
    this.intersectionObserver?.disconnect();

    this.imageObservers.forEach((observer) => observer.disconnect());
    this.imageObservers.clear();
    this.imageElements.clear();

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
      const actualImageWidth = this.imageElement.offsetWidth + 20; // Add spacing
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
        this.imageBounds = newBounds;
      }
    }
  }

  private setupIntersectionObserver() {
    const isDesktopView = isDesktop();
    const threshold = isDesktopView
      ? INTERSECTION_THRESHOLDS.DESKTOP_FULL_VISIBLE
      : INTERSECTION_THRESHOLDS.MOBILE_VISIBLE;

    const config: IntersectionObserverConfig = {
      threshold,
      onIntersectionChange: (isIntersecting: boolean) => {
        const wasIntersecting = this.isIntersecting;
        this.isIntersecting = isIntersecting;

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

  private performVisualSearchIfReady() {
    if (this.token) {
      const currentImageState = this.imageStates.get(this.currentImageIndex);
      if (!currentImageState?.searchCompleted) {
        this.performVisualSearch();
      } else {
        this.loadImageState();
      }
    }
  }

  private loadImageState() {
    const imageState = this.imageStates.get(this.currentImageIndex);
    if (imageState) {
      this.detectedObjects = imageState.detectedObjects;
      this.initialSearchCompleted = imageState.searchCompleted;
      this.searchResults = imageState.searchResults;
    }
  }

  private saveImageState() {
    const currentState = this.imageStates.get(this.currentImageIndex);
    this.imageStates.set(this.currentImageIndex, {
      detectedObjects: [...this.detectedObjects],
      searchCompleted: this.initialSearchCompleted,
      searchResults: [...this.searchResults],
      isVisible: currentState?.isVisible || false,
      imageElement: currentState?.imageElement || this.imageElement,
      imageBounds: currentState?.imageBounds || null,
      visualSearchId: currentState?.visualSearchId || null,
    });
  }

  private handleDetectedObjectClick = async (
    detectedObject: Rectangle,
    objectIndex: number,
    imageIndex: number = this.currentImageIndex,
  ) => {
    if (!this.token) return;

    this.selectedDetectedObject = detectedObject;
    this.isSearching = true;
    this.searchResults = [];
    this.currentResultIndex = 0;
    this.showModal = false;

    const imageElement =
      this.imageElements.get(imageIndex) || this.imageElement;

    const imageState = this.imageStates.get(imageIndex);
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
        this.searchResults = response.searchResults;
        this.modalPosition = response.modalPosition;
        this.currentResultIndex = 0;
        this.isSearching = false;

        if (this.searchResults.length > 0) {
          this.showModal = true;
        }

        this.vviinnShopTheLookDetectedObjectClick.emit({
          ...TEST_BASIC_EVENT_DATA,
          detectedObjectId: `detected-${imageIndex}-${objectIndex}`,
          product: this.searchResults[0] || null,
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
        this.initialSearchCompleted = true;
        this.isSearching = false;
      },
      (response: {
        detectedObjects: Rectangle[];
        searchResults: Recommendation[];
        visualSearchId?: string;
      }) => {
        this.detectedObjects = response.detectedObjects;

        const currentState = this.imageStates.get(this.currentImageIndex);
        if (currentState) {
          currentState.visualSearchId = response.visualSearchId || null;
          this.imageStates.set(this.currentImageIndex, currentState);
        }

        if (this.detectedObjects.length > 0) {
          this.isSearching = false;
          setTimeout(async () => {
            await this.handleDetectedObjectClick(this.detectedObjects[0], 0);
            this.initialSearchCompleted = true;
            this.saveImageState();
          }, TIMING.SEARCH_DELAY);
        } else {
          this.initialSearchCompleted = true;
          this.isSearching = false;
          this.saveImageState();
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

    this.showModal = false;
    this.selectedDetectedObject = null;
    this.searchResults = [];
    this.currentResultIndex = 0;
    this.modalPosition = null;
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
      this.currentProductIndex < this.searchResults.length - 1
    ) {
      this.currentProductIndex++;
    }
  };

  private renderDetectedObjectsWrapper = (imageIndex: number) => {
    const imageState = this.imageStates.get(imageIndex);

    if (
      !shouldRenderDetectedObjects(
        imageState,
        this.visibleImageIndices,
        imageIndex,
      )
    ) {
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

      this.showModal = false;
      this.selectedDetectedObject = null;
      this.modalPosition = null;
      this.searchResults = [];
      this.currentResultIndex = 0;
      this.detectedObjects = [];
      this.initialSearchCompleted = false;

      setTimeout(() => {
        this.updateImageBounds();
        this.performVisualSearchIfReady();
      }, TIMING.SLIDE_TRANSITION_DELAY);
    }
  };

  private handleImageRef = (el: HTMLImageElement, index: number) => {
    if (index === this.currentImageIndex || this.totalImages <= 1) {
      this.imageElement = el;
    }

    if (el) {
      this.imageElements.set(index, el);
      this.setupImageIntersectionObserver(el, index);

      // Update bounds immediately if image is already loaded, otherwise wait for load
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

      const imageState = this.imageStates.get(index);
      if (imageState) {
        const bounds = calculateImageBounds(el);
        if (bounds) {
          imageState.imageBounds = bounds;
          this.imageStates.set(index, imageState);
        }
      }
    });
  };

  private setupImageIntersectionObserver = (
    element: HTMLImageElement,
    index: number,
  ) => {
    const existingObserver = this.imageObservers.get(index);
    if (existingObserver) {
      existingObserver.disconnect();
    }

    const isDesktopView = isDesktop();
    const threshold = getVisibilityThreshold(isDesktopView);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const isVisible = entry.intersectionRatio >= threshold;
          this.updateImageVisibility(index, isVisible);
        });
      },
      { threshold },
    );

    observer.observe(element);
    this.imageObservers.set(index, observer);
  };

  private updateImageVisibility = (index: number, isVisible: boolean) => {
    const currentState = this.imageStates.get(index) || {
      detectedObjects: [],
      searchCompleted: false,
      searchResults: [],
      isVisible: false,
      imageElement: this.imageElements.get(index) || null,
      imageBounds: null,
      visualSearchId: null,
    };

    const wasVisible = currentState.isVisible;
    const stateChanged = wasVisible !== isVisible;

    if (!stateChanged) return;

    currentState.isVisible = isVisible;
    currentState.imageElement = this.imageElements.get(index) || null;

    if (isVisible && currentState.imageElement && !currentState.imageBounds) {
      currentState.imageBounds = calculateImageBounds(
        currentState.imageElement,
      );
    }

    this.imageStates.set(index, currentState);

    const isDesktopView = isDesktop();

    if (isVisible) {
      this.visibleImageIndices.add(index);
      if (!currentState.searchCompleted) {
        this.performVisualSearchForImage(index);
      }
    } else {
      if (!isDesktopView) {
        this.visibleImageIndices.delete(index);
      }
    }

    this.visibleImageIndices = new Set(this.visibleImageIndices);
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
        this.updateImageState(imageIndex, [], true, [], null);
        if (isCurrentImage) {
          this.isSearching = false;
        }
      },
      (response: {
        detectedObjects: Rectangle[];
        searchResults: Recommendation[];
        visualSearchId?: string;
      }) => {
        this.updateImageState(
          imageIndex,
          response.detectedObjects,
          true,
          response.searchResults,
          response.visualSearchId || null,
        );

        if (isCurrentImage) {
          this.isSearching = false;
        }

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

  private updateImageState = (
    index: number,
    detectedObjects: Rectangle[],
    searchCompleted: boolean,
    searchResults: Recommendation[],
    visualSearchId?: string | null,
  ) => {
    const currentState = this.imageStates.get(index) || {
      detectedObjects: [],
      searchCompleted: false,
      searchResults: [],
      isVisible: false,
      imageElement: null,
      imageBounds: null,
      visualSearchId: null,
    };

    this.imageStates.set(index, {
      ...currentState,
      detectedObjects,
      searchCompleted,
      searchResults,
      ...(visualSearchId !== undefined && { visualSearchId }),
    });
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

    this.showModal = false;
    this.selectedDetectedObject = null;
    this.modalPosition = null;
    this.searchResults = [];
    this.currentResultIndex = 0;
    this.detectedObjects = [];
    this.initialSearchCompleted = false;

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
      detectedObjects: this.detectedObjects,
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
      searchResults: this.searchResults,
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
