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
import { TEST_IMAGE_URL, TEST_BASIC_EVENT_DATA } from "./test-data";
import { fromImage } from "../../geometry/Rectangle";

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

  @Prop() imageUrl: string = TEST_IMAGE_URL;
  @Prop() currentImageIndex: number = 0;
  @Prop() totalImages: number = 1;
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
  @State() modalPosition: { x: number; y: number } | null = null;
  @State() isSearching: boolean = false;
  @State() componentToken: string | null = null;
  @State() initialSearchCompleted: boolean = false;

  @Event()
  vviinnShopTheLookDetectedObjectClick: EventEmitter<ShopTheLookEventData>;
  @Event() vviinnShopTheLookProductClick: EventEmitter<ShopTheLookEventData>;
  @Event() vviinnShopTheLookModalClose: EventEmitter<BasicEventData>;

  private imageElement: HTMLImageElement;

  componentWillLoad() {
    // Initialize image bounds early to avoid re-renders
    this.imageBounds = {
      left: 0,
      top: 0,
      width: this.width,
      height: this.height,
    };
  }

  componentDidLoad() {
    this.updateImageBounds();
    this.imageElement?.addEventListener("load", () => this.updateImageBounds());
    window.addEventListener("resize", () => this.updateImageBounds());

    // Initialize visual search if enabled
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
      this.imageBounds = fromImage(this.imageElement);
    }
  }

  private handleDetectedObjectClick = async (
    detectedObject: Rectangle,
    index: number,
  ) => {
    if (!this.enableVisualSearch || !this.token) return;

    // Continue with search even if modal is already open
    this.selectedDetectedObject = detectedObject;
    this.setModalPosition(detectedObject);
    this.isSearching = true;
    this.componentToken = this.token;

    // Clear old results while loading new ones
    this.searchResults = [];
    this.currentResultIndex = 0;

    // Hide modal while loading new results
    this.showModal = false;

    try {
      // Import search store
      const { makeVisualSearchRequest } = await import(
        "../../store/search.store"
      );

      // We need to use a temporary store approach since the function requires state
      // Import the store utilities to set the search parameters
      const { componentsState } = await import("../../store/search.store");
      const tempState = componentsState;
      
      // Set the search area and image bounds temporarily
      tempState.searchArea = detectedObject;
      tempState.imageBounds = { left: 0, top: 0, width: 1, height: 1 };

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
          // Store data in component
          this.searchResults = searchResponse.data?.products || [];
          this.currentResultIndex = 0;
          this.isSearching = false;

          // Only show modal if we have results
          if (this.searchResults.length > 0) {
            this.showModal = true;
          }

          // Emit event
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
    if (!this.enableVisualSearch || !this.token || !this.imageUrl) return;

    try {
      // Store token in component
      this.componentToken = this.token;

      // Upload image and get detected objects
      const imageResponse = await fetch(this.imageUrl);
      const imageBlob = await imageResponse.blob();
      const imageFile = new File([imageBlob], "shop-the-look-image.jpg", {
        type: "image/jpeg",
      });

      // Make upload request to get detected objects
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
          // Store detected objects from response
          this.detectedObjects = uploadResponse.interactions?.suggestedSearchAreas?.map(area => area.rectangle) || [];


          // Automatically select the first detected object and wait for second request
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
    if (this.isSearching) return; // Don't close modal while searching

    // Only close if clicking on overlay, not on detected objects
    if (event && event.target !== event.currentTarget) return;

    this.showModal = false;
    this.selectedDetectedObject = null;
    this.searchResults = [];
    this.currentResultIndex = 0;
    this.modalPosition = null;
    this.vviinnShopTheLookModalClose.emit(this.basicEventData);
  };

  private setModalPosition = (detectedObject: Rectangle) => {
    if (!this.imageElement) return;

    // Get image element's position and dimensions
    const imageRect = this.imageElement.getBoundingClientRect();

    // Calculate object center coordinates
    const objectCenterX = detectedObject.left + (detectedObject.width / 2);
    const objectCenterY = detectedObject.top + (detectedObject.height / 2);

    // Convert relative coordinates to pixel coordinates within the image
    const pixelX = objectCenterX * this.width;
    const pixelY = objectCenterY * this.height;

    // Position modal to the left of the object center at the same distance as object width
    const modalDistance = detectedObject.width * this.width; // Same distance as object width
    this.modalPosition = {
      x: imageRect.left + pixelX - modalDistance,
      y: imageRect.top + pixelY,
    };
  };

  private renderDetectedObjects() {
    if (
      !this.imageBounds ||
      !this.detectedObjects.length ||
      !this.initialSearchCompleted
    )
      return null;

    return this.detectedObjects.map((detectedObject, index) => (
      <vviinn-detected-object
        key={`detected-${index}`}
        detectedObject={detectedObject}
        selectedDetectedObject={this.selectedDetectedObject}
        basicEventData={this.basicEventData}
        imageBounds={this.imageBounds}
        showInWidget={false}
        style={{
          zIndex: "10",
        }}
        onVviinnSelectObject={(event) => {
          event.stopPropagation();
          this.handleDetectedObjectClick(event.detail.detectedObject, index);
        }}
      />
    ));
  }

  private renderPaginationDots() {
    if (this.totalImages <= 1) return null;

    return (
      <div class="pagination-dots">
        {Array.from({ length: this.totalImages }, (_, index) => (
          <div
            key={index}
            class={{
              dot: true,
              active: index === this.currentImageIndex,
            }}
          />
        ))}
      </div>
    );
  }

  private renderProductGrid() {
    if (!this.searchResults.length) return null;

    // Always show first 4 products
    const currentProducts = this.searchResults.slice(0, 4);

    return (
      <div class="search-results-grid">
        {currentProducts.map((product, index) => (
          <div
            key={`${product.productId}-${index}`}
            class="result-item"
            onClick={() => this.handleProductClick(product)}
          >
            <div class="result-image">
              <img
                src={product.image?.thumbnail || product.image?.original}
                alt={product.title}
                loading="lazy"
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  private renderModal() {
    if (!this.showModal || !this.selectedDetectedObject) return null;

    const modalStyle = this.modalPosition
      ? {
          "--modal-x": `${this.modalPosition.x}px`,
          "--modal-y": `${this.modalPosition.y}px`,
        }
      : {};

    return (
      <div class="modal-overlay" onClick={(e) => this.handleModalClose(e)}>
        <div
          class="modal-content-wrapper"
          style={modalStyle}
          onClick={(e) => e.stopPropagation()}
        >
          <div class="modal-body">
            {this.renderProductGrid()}
          </div>
          {this.searchResults.length > 4 && (
            <div class="modal-arrow">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M7.5 5L12.5 10L7.5 15"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          )}
        </div>
      </div>
    );
  }

  render() {
    return (
      <Host>
        <div class={`shop-the-look-container ${this.showModal ? 'modal-open' : ''}`}>
          <div class="main-content">
            <div class="image-container">
              <img
                ref={(el) => (this.imageElement = el)}
                src={this.imageUrl}
                alt="Shop the look"
                class="main-image"
                style={{
                  width: `${this.width}px`,
                  height: `${this.height}px`,
                }}
              />
              {this.renderDetectedObjects()}
            </div>
            {this.renderPaginationDots()}
          </div>
          {this.renderModal()}
        </div>
      </Host>
    );
  }
}
