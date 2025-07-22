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
import { Rectangle, VisualSearchResponse } from "../../interfaces/search";
import { BasicEventData } from "../../recommendation/events";
import { TEST_IMAGE_URLS, TEST_BASIC_EVENT_DATA } from "./test-data";
import { register } from "swiper/element";
import {
  calculateModalPosition,
  calculateImageBounds,
  hasImageBoundsChanged,
  createImageFile,
  resetSearchState,
  ModalPosition,
} from "./helpers";
import {
  renderDetectedObjects,
  renderSwiper,
  renderModal,
  DetectedObjectsProps,
  SwiperProps,
  ModalProps,
} from "./render-helpers";

if (typeof window !== 'undefined') {
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

  @Event()
  vviinnShopTheLookDetectedObjectClick: EventEmitter<ShopTheLookEventData>;
  @Event() vviinnShopTheLookProductClick: EventEmitter<ShopTheLookEventData>;
  @Event() vviinnShopTheLookModalClose: EventEmitter<BasicEventData>;

  private imageElement: HTMLImageElement;

  componentWillLoad() {
    this.imageBounds = {
      left: 0,
      top: 0,
      width: this.width,
      height: this.height,
    };
    this.totalImages = this.imageUrls.length;
    if (this.token) {
      this.componentToken = this.token;
    }
  }

  componentDidLoad() {
    this.updateImageBounds();
    this.imageElement?.addEventListener("load", () => this.updateImageBounds());
    window.addEventListener("resize", () => this.updateImageBounds());

    if (this.enableVisualSearch && this.token) {
      this.performVisualSearch();
    }
  }

  disconnectedCallback() {
    this.imageElement?.removeEventListener("load", () =>
      this.updateImageBounds(),
    );
    window.removeEventListener("resize", () => this.updateImageBounds());
  }

  private updateImageBounds() {
    if (this.imageElement) {
      const newBounds = calculateImageBounds(this.imageElement);
      if (newBounds && hasImageBoundsChanged(this.imageBounds, newBounds)) {
        this.imageBounds = newBounds;
      }
    }
  }

  private handleDetectedObjectClick = async (
    detectedObject: Rectangle,
    index: number,
  ) => {
    if (!this.enableVisualSearch || !this.token) return;

    this.selectedDetectedObject = detectedObject;
    this.modalPosition = calculateModalPosition(detectedObject, this.imageElement, this.width, this.height);
    this.isSearching = true;
    this.searchResults = [];
    this.currentResultIndex = 0;
    this.showModal = false;

    try {
      const { makeVisualSearchRequest, componentsState } = await import(
        "../../store/search.store"
      );

      componentsState.searchArea = detectedObject;
      componentsState.imageBounds = { left: 0, top: 0, width: 1, height: 1 };

      const result = await makeVisualSearchRequest(
        "components",
        null,
        this.componentToken || this.token,
      );

      E.fold(
        (error) => {
          console.error("Visual search failed:", error);
          this.isSearching = false;
        },
        (searchResponse: VisualSearchResponse) => {
          this.searchResults = searchResponse.data?.products || [];
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
    } catch (error) {
      console.error("Visual search failed:", error);
      this.isSearching = false;
    }
  };

  private performVisualSearch = async () => {
    const currentImageUrl = this.imageUrls[this.currentImageIndex];
    if (!this.enableVisualSearch || !this.token || !currentImageUrl) return;

    try {
      const imageFile = await createImageFile(currentImageUrl);
      const { makeUploadFileRequest } = await import(
        "../../store/search.store"
      );

      const result = await makeUploadFileRequest(
        "components",
        this.componentToken || this.token,
      )(imageFile);

      E.fold(
        (error) => {
          console.error("Upload failed:", error);
          this.initialSearchCompleted = true;
        },
        (uploadResponse: VisualSearchResponse) => {
          this.detectedObjects =
            uploadResponse.interactions?.suggestedSearchAreas?.map(
              (area) => area.rectangle,
            ) || [];

          if (this.detectedObjects.length > 0) {
            setTimeout(async () => {
              await this.handleDetectedObjectClick(this.detectedObjects[0], 0);
              this.initialSearchCompleted = true;
            }, 500);
          } else {
            this.initialSearchCompleted = true;
          }
        },
      )(result);
    } catch (error) {
      console.error("Visual search initialization failed:", error);
    }
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
    const newIndex = event.detail[0].activeIndex;
    if (newIndex !== this.currentImageIndex) {
      this.currentImageIndex = newIndex;
      
      const resetState = resetSearchState();
      Object.assign(this, resetState);
      
      setTimeout(() => {
        this.updateImageBounds();
        if (this.enableVisualSearch && this.token) {
          this.performVisualSearch();
        }
      }, 100);
    }
  };

  private handleImageRef = (el: HTMLImageElement, index: number) => {
    if (index === this.currentImageIndex || this.totalImages <= 1) {
      this.imageElement = el;
    }
  };

  private renderSwiperWrapper = () => {
    const props: SwiperProps = {
      totalImages: this.totalImages,
      imageUrls: this.imageUrls,
      currentImageIndex: this.currentImageIndex,
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
          </div>
          {this.renderModalWrapper()}
        </div>
      </Host>
    );
  }
}
