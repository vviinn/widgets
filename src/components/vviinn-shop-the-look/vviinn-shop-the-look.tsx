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
} from "./helpers";
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
    }
  > = new Map();

  @Event()
  vviinnShopTheLookDetectedObjectClick: EventEmitter<ShopTheLookEventData>;
  @Event() vviinnShopTheLookProductClick: EventEmitter<ShopTheLookEventData>;
  @Event() vviinnShopTheLookModalClose: EventEmitter<BasicEventData>;

  private imageElement: HTMLImageElement;
  private intersectionObserver: IntersectionObserver;

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
    this.updateImageBounds();
    this.imageElement?.addEventListener("load", () => this.updateImageBounds());
    window.addEventListener("resize", () => this.updateImageBounds());
    this.setupIntersectionObserver();
    this.setupSwiperEventListener();
  }

  disconnectedCallback() {
    this.imageElement?.removeEventListener("load", () =>
      this.updateImageBounds(),
    );
    window.removeEventListener("resize", () => this.updateImageBounds());
    this.intersectionObserver?.disconnect();

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

  private updateImageBounds() {
    if (this.imageElement) {
      const newBounds = calculateImageBounds(this.imageElement);
      if (newBounds && hasImageBoundsChanged(this.imageBounds, newBounds)) {
        this.imageBounds = newBounds;
      }
    } else {
      // Ensure imageBounds is always valid, even if imageElement is not ready
      if (!this.imageBounds || this.imageBounds.left === undefined) {
        this.imageBounds = {
          left: 0,
          top: 0,
          width: this.width,
          height: this.height,
        };
      }
    }
  }

  private setupIntersectionObserver() {
    const config: IntersectionObserverConfig = {
      threshold: 0.33,
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
    }, 200);
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
    this.imageStates.set(this.internalCurrentImageIndex, {
      detectedObjects: [...this.detectedObjects],
      searchCompleted: this.initialSearchCompleted,
      searchResults: [...this.searchResults],
    });
  }

  private handleDetectedObjectClick = async (
    detectedObject: Rectangle,
    index: number,
  ) => {
    if (!this.enableVisualSearch || !this.token) return;

    this.selectedDetectedObject = detectedObject;
    this.isSearching = true;
    this.searchResults = [];
    this.currentResultIndex = 0;
    this.showModal = false;

    const params: DetectedObjectClickParams = {
      detectedObject,
      imageElement: this.imageElement,
      width: this.width,
      height: this.height,
      token: this.token,
      componentToken: this.componentToken,
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
          detectedObjectId: `detected-${index}`,
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
          }, 500);
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

  private renderDetectedObjectsWrapper = () => {
    const props: DetectedObjectsProps = {
      imageBounds: this.imageBounds,
      detectedObjects: this.detectedObjects,
      initialSearchCompleted: this.initialSearchCompleted,
      selectedDetectedObject: this.selectedDetectedObject,
      basicEventData: this.basicEventData,
      onSelectObject: this.handleDetectedObjectClick,
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
      }, 100);
    }
  };

  private handleImageRef = (el: HTMLImageElement, index: number) => {
    if (index === this.internalCurrentImageIndex || this.totalImages <= 1) {
      this.imageElement = el;
    }
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
          {this.renderModalWrapper()}
        </div>
      </Host>
    );
  }
}
