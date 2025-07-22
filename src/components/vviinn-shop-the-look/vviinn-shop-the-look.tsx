import {
  Component,
  Host,
  h,
  Prop,
  State,
  Event,
  EventEmitter,
  Element,
} from "@stencil/core";
import * as E from "fp-ts/lib/Either";
import { Recommendation } from "../../interfaces/recommendation";
import { Rectangle } from "../../interfaces/search";
import { BasicEventData } from "../../recommendation/events";
import { TEST_IMAGE_URLS, TEST_BASIC_EVENT_DATA } from "./test-data";
import { register } from "swiper/element";
import {
  calculateImageBounds,
  hasImageBoundsChanged,
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

if (typeof window !== "undefined") {
  register();
}

export interface ShopTheLookEventData extends BasicEventData {
  detectedObjectId: string;
  product: Recommendation;
}

@Component({
  tag: "vviinn-shop-the-look",
  styleUrl: "vviinn-shop-the-look.css",
  shadow: true,
})
export class VviinnShopTheLook {
  @Element() el: HTMLElement;

  @Prop() imageUrls: string[] = TEST_IMAGE_URLS;
  @Prop() currentImageIndex: number = 0;
  @State() internalCurrentImageIndex: number = 0;
  @State() totalImages: number = 1;
  @Prop() basicEventData: BasicEventData = TEST_BASIC_EVENT_DATA;
  @Prop() width: number = 350;
  @Prop() height: number = 468;
  @Prop() token: string;
  @Prop() enableVisualSearch: boolean = true;

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
    }
  > = new Map();
  @State() forceRerender: number = 0;
  @State() visibleImageIndices: Set<number> = new Set();

  @Event()
  vviinnShopTheLookDetectedObjectClick: EventEmitter<ShopTheLookEventData>;
  @Event() vviinnShopTheLookProductClick: EventEmitter<ShopTheLookEventData>;
  @Event() vviinnShopTheLookModalClose: EventEmitter<BasicEventData>;

  private imageElement: HTMLImageElement;
  private intersectionObserver: IntersectionObserver;
  private imageObservers: Map<number, IntersectionObserver> = new Map();
  private imageElements: Map<number, HTMLImageElement> = new Map();

  componentWillLoad() {
    this.imageBounds = {
      left: 0,
      top: 0,
      width: this.width,
      height: this.height,
    };
    this.totalImages = this.imageUrls.length;
    this.internalCurrentImageIndex = this.currentImageIndex;
    if (this.token) {
      this.componentToken = this.token;
    }
    
  }

  componentDidLoad() {
    // Defer image bounds update to avoid Stencil warning about state changes during componentDidLoad
    setTimeout(() => {
      this.updateImageBounds();
    }, 0);
    
    this.imageElement?.addEventListener("load", () => this.updateImageBounds());
    window.addEventListener("resize", this.handleResize);
    this.setupIntersectionObserver();
    this.setupSwiperEventListener();
  }

  disconnectedCallback() {
    this.imageElement?.removeEventListener("load", () =>
      this.updateImageBounds(),
    );
    window.removeEventListener("resize", this.handleResize);
    this.intersectionObserver?.disconnect();

    // Clean up individual image observers
    this.imageObservers.forEach(observer => observer.disconnect());
    this.imageObservers.clear();
    this.imageElements.clear();

    // Clean up swiper event listeners
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
    // Force re-render to update responsive styles
    this.forceRerender = Date.now();
  };

  private updateImageBounds() {
    if (this.imageElement) {
      const newBounds = calculateImageBounds(this.imageElement);
      if (newBounds && hasImageBoundsChanged(this.imageBounds, newBounds)) {
        this.imageBounds = newBounds;
      }
    }
    // Note: Initial imageBounds is set in componentWillLoad, no need to set here again
  }

  private setupIntersectionObserver() {
    // Desktop: 100% visible (threshold 1.0), Mobile: 33% visible (threshold 0.33)
    const isDesktopView = isDesktop();
    const threshold = isDesktopView ? INTERSECTION_THRESHOLDS.DESKTOP_FULL_VISIBLE : INTERSECTION_THRESHOLDS.MOBILE_VISIBLE;
    
    const config: IntersectionObserverConfig = {
      threshold,
      onIntersectionChange: (isIntersecting: boolean) => {
        const wasIntersecting = this.isIntersecting;
        this.isIntersecting = isIntersecting;
        
        if (!wasIntersecting && this.isIntersecting) {
          this.performVisualSearchIfReady();
        }
      }
    };

    this.intersectionObserver = setupIntersectionObserver(this.el, config);
  }

  private setupSwiperEventListener() {
    // Use setTimeout to ensure swiper is fully initialized
    setTimeout(() => {
      const swiperContainer =
        this.el.shadowRoot?.querySelector("swiper-container");
      if (swiperContainer) {
        swiperContainer.addEventListener(
          "swiperslidechange",
          this.handleSlideChange,
        );
        // Also try the alternative event name
        swiperContainer.addEventListener("slidechange", this.handleSlideChange);
      }
    }, TIMING.SWIPER_INIT_DELAY);
  }

  private performVisualSearchIfReady() {
    if (this.enableVisualSearch && this.token) {
      const currentImageState = this.imageStates.get(this.internalCurrentImageIndex);
      if (!currentImageState?.searchCompleted) {
        this.performVisualSearch();
      } else {
        this.loadImageState();
      }
    }
  }

  private loadImageState() {
    const imageState = this.imageStates.get(this.internalCurrentImageIndex);
    if (imageState) {
      this.detectedObjects = imageState.detectedObjects;
      this.initialSearchCompleted = imageState.searchCompleted;
      this.searchResults = imageState.searchResults;
    }
  }

  private saveImageState() {
    const currentState = this.imageStates.get(this.internalCurrentImageIndex);
    this.imageStates.set(this.internalCurrentImageIndex, {
      detectedObjects: [...this.detectedObjects],
      searchCompleted: this.initialSearchCompleted,
      searchResults: [...this.searchResults],
      isVisible: currentState?.isVisible || false,
      imageElement: currentState?.imageElement || this.imageElement,
      imageBounds: currentState?.imageBounds || null,
    });
  }

  private handleDetectedObjectClick = async (
    detectedObject: Rectangle,
    objectIndex: number,
    imageIndex: number = this.internalCurrentImageIndex,
  ) => {
    if (!this.enableVisualSearch || !this.token) return;

    this.selectedDetectedObject = detectedObject;
    this.isSearching = true;
    this.searchResults = [];
    this.currentResultIndex = 0;
    this.showModal = false;

    // Get the correct image element for this image index
    const imageElement = this.imageElements.get(imageIndex) || this.imageElement;
    
    const params: DetectedObjectClickParams = {
      detectedObject,
      imageElement,
      token: this.token,
      componentToken: this.componentToken,
      containerElement: this.el,
    };

    const result = await handleDetectedObjectClick(params);

    E.fold(
      (error: string) => {
        console.error("Visual search failed:", error);
        this.isSearching = false;
      },
      (response: { searchResults: Recommendation[]; modalPosition: ModalPosition }) => {
        this.searchResults = response.searchResults;
        this.modalPosition = response.modalPosition;
        this.currentResultIndex = 0;
        this.isSearching = false;

        if (this.searchResults.length > 0) {
          this.showModal = true;
        }

        this.vviinnShopTheLookDetectedObjectClick.emit({
          ...this.basicEventData,
          detectedObjectId: `detected-${imageIndex}-${objectIndex}`,
          product: this.searchResults[0] || null,
        });
      },
    )(result);
  };

  private performVisualSearch = async () => {
    const currentImageUrl = this.imageUrls[this.internalCurrentImageIndex];
    if (!this.enableVisualSearch || !this.token || !currentImageUrl) return;

    const params: VisualSearchParams = {
      imageUrl: currentImageUrl,
      token: this.token,
      componentToken: this.componentToken,
    };

    const result = await performVisualSearch(params);

    E.fold(
      (error: string) => {
        console.error("Visual search failed:", error);
        this.initialSearchCompleted = true;
      },
      (response: { detectedObjects: Rectangle[]; searchResults: Recommendation[] }) => {
        this.detectedObjects = response.detectedObjects;

        if (this.detectedObjects.length > 0) {
          setTimeout(async () => {
            await this.handleDetectedObjectClick(this.detectedObjects[0], 0);
            this.initialSearchCompleted = true;
            this.saveImageState();
          }, TIMING.SEARCH_DELAY);
        } else {
          this.initialSearchCompleted = true;
          this.saveImageState();
        }
      },
    )(result);
  };

  private handleProductClick = (product: Recommendation) => {
    this.vviinnShopTheLookProductClick.emit({
      ...this.basicEventData,
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
    this.vviinnShopTheLookModalClose.emit(this.basicEventData);
  };

  private renderDetectedObjectsWrapper = (imageIndex: number) => {
    const imageState = this.imageStates.get(imageIndex);
    
    if (!shouldRenderDetectedObjects(imageState, this.visibleImageIndices, imageIndex)) {
      return null;
    }
    
    // Use cached image bounds instead of recalculating
    const imageBounds = imageState.imageBounds;
    
    const props: DetectedObjectsProps = {
      imageBounds,
      detectedObjects: imageState.detectedObjects,
      initialSearchCompleted: imageState.searchCompleted,
      selectedDetectedObject: this.selectedDetectedObject,
      basicEventData: this.basicEventData,
      onSelectObject: (detectedObject: Rectangle, objectIndex: number) => 
        this.handleDetectedObjectClick(detectedObject, objectIndex, imageIndex),
    };
    return renderDetectedObjects(props);
  };

  private handleSlideChange = (event: any) => {
    const newIndex = extractSlideIndex(event);

    if (newIndex !== null && newIndex !== this.internalCurrentImageIndex) {
      this.internalCurrentImageIndex = newIndex;

      // Reset UI state and clear previous image data immediately
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
    if (index === this.internalCurrentImageIndex || this.totalImages <= 1) {
      this.imageElement = el;
    }
    
    // Store reference for individual tracking
    if (el) {
      this.imageElements.set(index, el);
      this.setupImageIntersectionObserver(el, index);
    }
  };

  private setupImageIntersectionObserver = (element: HTMLImageElement, index: number) => {
    // Clean up existing observer for this image
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
      { threshold }
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
    };
    
    const wasVisible = currentState.isVisible;
    const stateChanged = wasVisible !== isVisible;
    
    if (!stateChanged) return; // No change, avoid unnecessary updates
    
    currentState.isVisible = isVisible;
    currentState.imageElement = this.imageElements.get(index) || null;
    
    // Calculate and cache image bounds when becoming visible
    if (isVisible && currentState.imageElement && !currentState.imageBounds) {
      currentState.imageBounds = calculateImageBounds(currentState.imageElement);
    }
    
    this.imageStates.set(index, currentState);
    
    // Desktop rule: Keep images in visible indices even when partially sliced
    // Mobile rule: Only track fully visible images
    const isDesktopView = isDesktop();
    
    if (isVisible) {
      this.visibleImageIndices.add(index);
      // Only trigger search if not already completed and this is the first time becoming visible
      if (!currentState.searchCompleted) {
        this.performVisualSearchForImage(index);
      }
    } else {
      // On desktop, keep partially visible images in the visible set to preserve objects
      if (!isDesktopView) {
        this.visibleImageIndices.delete(index);
      }
      // On desktop, only remove from visible set if threshold is very low (completely hidden)
    }
    
    // Update the visible indices state to trigger re-render only if there was a real change
    this.visibleImageIndices = new Set(this.visibleImageIndices);
  };

  private performVisualSearchForImage = async (imageIndex: number) => {
    const imageUrl = this.imageUrls[imageIndex];
    if (!this.enableVisualSearch || !this.token || !imageUrl) return;

    const params: VisualSearchParams = {
      imageUrl,
      token: this.token,
      componentToken: this.componentToken,
    };

    const result = await performVisualSearch(params);

    E.fold(
      (error: string) => {
        console.error(`Visual search failed for image ${imageIndex}:`, error);
        this.updateImageState(imageIndex, [], true, []);
      },
      (response: { detectedObjects: Rectangle[]; searchResults: Recommendation[] }) => {
        this.updateImageState(imageIndex, response.detectedObjects, true, response.searchResults);
        
        // Auto-select first object only for the first image (index 0)
        if (imageIndex === 0 && response.detectedObjects.length > 0) {
          setTimeout(async () => {
            await this.handleDetectedObjectClick(response.detectedObjects[0], 0, imageIndex);
          }, TIMING.SEARCH_DELAY);
        }
      }
    )(result);
  };

  private updateImageState = (
    index: number, 
    detectedObjects: Rectangle[], 
    searchCompleted: boolean, 
    searchResults: Recommendation[]
  ) => {
    const currentState = this.imageStates.get(index) || {
      detectedObjects: [],
      searchCompleted: false,
      searchResults: [],
      isVisible: false,
      imageElement: null,
      imageBounds: null,
    };
    
    this.imageStates.set(index, {
      ...currentState,
      detectedObjects,
      searchCompleted,
      searchResults,
    });
  };

  private handleNavigatePrev = () => {
    if (this.internalCurrentImageIndex > 0) {
      const newIndex = this.internalCurrentImageIndex - 1;
      this.updateSlideIndex(newIndex);
      
      // Get swiper and programmatically slide
      const swiperContainer = this.el.shadowRoot?.querySelector('swiper-container');
      if (swiperContainer && (swiperContainer as any).swiper) {
        (swiperContainer as any).swiper.slideTo(newIndex);
      }
    }
  };

  private handleNavigateNext = () => {
    if (this.internalCurrentImageIndex < this.totalImages - 1) {
      const newIndex = this.internalCurrentImageIndex + 1;
      this.updateSlideIndex(newIndex);
      
      // Get swiper and programmatically slide
      const swiperContainer = this.el.shadowRoot?.querySelector('swiper-container');
      if (swiperContainer && (swiperContainer as any).swiper) {
        (swiperContainer as any).swiper.slideTo(newIndex);
      }
    }
  };

  private updateSlideIndex = (newIndex: number) => {
    this.internalCurrentImageIndex = newIndex;

    // Reset UI state and clear previous image data immediately
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

  private shouldShowArrows = (): boolean => {
    // Simple heuristic: show arrows if we have more than 3 images on desktop
    // or if the total width of images would exceed viewport width
    const isDesktopView = isDesktop();
    if (!isDesktopView) return false;
    
    // Show arrows if we have more than what can reasonably fit
    const estimatedImageWidth = this.width + 20; // image width + space between
    const availableWidth = window.innerWidth - 100; // account for padding/margins
    const maxImagesVisible = Math.floor(availableWidth / estimatedImageWidth);
    
    return this.totalImages > maxImagesVisible;
  };

  private renderSwiperWrapper = () => {
    const props: SwiperProps = {
      totalImages: this.totalImages,
      imageUrls: this.imageUrls,
      currentImageIndex: this.internalCurrentImageIndex,
      width: this.width,
      height: this.height,
      imageElement: this.imageElement,
      detectedObjects: this.detectedObjects,
      onSlideChange: this.handleSlideChange,
      onImageRef: this.handleImageRef,
      renderDetectedObjects: this.renderDetectedObjectsWrapper,
      onNavigatePrev: this.handleNavigatePrev,
      onNavigateNext: this.handleNavigateNext,
      shouldShowArrows: this.shouldShowArrows(),
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
          {/* Modal positioned within component boundaries */}
          {this.renderModalWrapper()}
        </div>
      </Host>
    );
  }
}
