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
import { Recommendation } from "../../interfaces/recommendation";
import { Rectangle } from "../../interfaces/search";
import { BasicEventData } from "../../recommendation/events";
import { TEST_HOTSPOTS, TEST_PRODUCTS, TEST_BASIC_EVENT_DATA, TEST_IMAGE_URL } from "./test-data";
import { fromImage } from "../../geometry/Rectangle";

export interface ShopTheLookHotspot {
  id: string;
  position: Rectangle;
  product: Recommendation;
}

export interface ShopTheLookProduct {
  id: string;
  category: "sweaters" | "trousers" | "shoes";
  products: Recommendation[];
}

export interface ShopTheLookEventData extends BasicEventData {
  hotspotId: string;
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
  @Prop() hotspots: ShopTheLookHotspot[] = TEST_HOTSPOTS;
  @Prop() products: ShopTheLookProduct[] = TEST_PRODUCTS;
  @Prop() currentImageIndex: number = 0;
  @Prop() totalImages: number = 1;
  @Prop() basicEventData: BasicEventData = TEST_BASIC_EVENT_DATA;
  @Prop() width: number = 350;
  @Prop() height: number = 468;

  @State() selectedHotspot: ShopTheLookHotspot | null = null;
  @State() showModal: boolean = false;
  @State() selectedTab: "style" | "color" = "style";
  @State() imageBounds: Rectangle | null = null;

  @Event() vviinnShopTheLookHotspotClick: EventEmitter<ShopTheLookEventData>;
  @Event() vviinnShopTheLookProductClick: EventEmitter<ShopTheLookEventData>;
  @Event() vviinnShopTheLookModalClose: EventEmitter<BasicEventData>;

  private imageElement: HTMLImageElement;

  componentDidLoad() {
    this.updateImageBounds();
    this.imageElement?.addEventListener("load", () => this.updateImageBounds());
    window.addEventListener("resize", () => this.updateImageBounds());
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

  private handleHotspotClick = (hotspot: ShopTheLookHotspot) => {
    this.selectedHotspot = hotspot;
    this.showModal = true;

    this.vviinnShopTheLookHotspotClick.emit({
      ...this.basicEventData,
      hotspotId: hotspot.id,
      product: hotspot.product,
    });
  };

  private handleProductClick = (product: Recommendation) => {
    this.vviinnShopTheLookProductClick.emit({
      ...this.basicEventData,
      hotspotId: this.selectedHotspot?.id || "",
      product,
    });
  };

  private handleModalClose = () => {
    this.showModal = false;
    this.selectedHotspot = null;
    this.vviinnShopTheLookModalClose.emit(this.basicEventData);
  };

  private handleTabChange = (tab: "style" | "color") => {
    this.selectedTab = tab;
  };

  private renderHotspots() {
    if (!this.imageBounds) return null;

    return this.hotspots.map((hotspot) => (
      <vviinn-detected-object
        key={hotspot.id}
        detectedObject={hotspot.position}
        selectedDetectedObject={this.selectedHotspot?.position}
        basicEventData={this.basicEventData}
        imageBounds={this.imageBounds}
        showInWidget={false}
        onVviinnSelectObject={() => this.handleHotspotClick(hotspot)}
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
    const categories = [
      { key: "sweaters", label: "Sweaters" },
      { key: "trousers", label: "Trousers" },
      { key: "shoes", label: "Shoes" },
    ];

    return categories.map((category) => {
      const categoryProducts = this.products.find(
        (p) => p.category === category.key,
      );
      if (!categoryProducts?.products.length) return null;

      return (
        <div key={category.key} class="product-category">
          <h3 class="category-title">{category.label}</h3>
          <div class="product-section">
            <div class="product-item" onClick={() => this.handleProductClick(categoryProducts.products[0])}>
              <div class="product-image">
                <img
                  src={categoryProducts.products[0].image?.original || categoryProducts.products[0].image?.thumbnail}
                  alt={categoryProducts.products[0].title}
                  loading="lazy"
                />
              </div>
              <div class="product-info">
                <div class="product-name">
                  {categoryProducts.products[0].title}
                </div>
                <div class="product-price">
                  € {categoryProducts.products[0].price?.actual || categoryProducts.products[0].price?.sale}
                </div>
              </div>
            </div>
            <div class="explore-more">
              <div class="explore-button">
                <div class="arrow-icon">→</div>
              </div>
              <div class="explore-text">
                Explore more
                <br />
                options
              </div>
            </div>
          </div>
        </div>
      );
    });
  }

  private renderModal() {
    if (!this.showModal) return null;

    return (
      <div class="modal-overlay">
        <div class="modal-content">
          <div class="modal-header">
            <button class="close-button" onClick={this.handleModalClose}>
              ×
            </button>
            <div class="modal-title">
              <div class="title-image">
                <img src={this.imageUrl} alt="Product" />
              </div>
              <span>On this image</span>
            </div>
            <div class="tab-controls">
              <button
                class={{
                  "tab-button": true,
                  active: this.selectedTab === "style",
                }}
                onClick={() => this.handleTabChange("style")}
              >
                Style
              </button>
              <button
                class={{
                  "tab-button": true,
                  active: this.selectedTab === "color",
                }}
                onClick={() => this.handleTabChange("color")}
              >
                Color
              </button>
            </div>
          </div>
          <div class="modal-body">{this.renderProductGrid()}</div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <Host>
        <div class="shop-the-look-container">
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
              {this.renderHotspots()}
            </div>
            {this.renderPaginationDots()}
          </div>
          {this.renderModal()}
        </div>
      </Host>
    );
  }
}
