import { h } from "@stencil/core";
import { Rectangle } from "../../interfaces/search";
import { Recommendation } from "../../interfaces";
import { BasicEventData } from "../../recommendation/events";
import { ModalPosition } from "./helpers";
import { isDesktop } from "../../helpers/device/checkDeviceType";
import {
  configureSwiperElement,
  getSwiperStyles,
} from "../../utils/swiper/swiperUtils";
import { SecondaryActionIcon } from "../vviinn-icons/icons/SecondaryActionIcon";

export interface DetectedObjectsProps {
  imageBounds: Rectangle | null;
  detectedObjects: Rectangle[];
  initialSearchCompleted: boolean;
  selectedDetectedObject: Rectangle | null;
  basicEventData: BasicEventData;
  onSelectObject: (detectedObject: Rectangle, index: number) => void;
}

export const renderDetectedObjects = (props: DetectedObjectsProps) => {
  const {
    imageBounds,
    detectedObjects,
    initialSearchCompleted,
    selectedDetectedObject,
    basicEventData,
    onSelectObject,
  } = props;

  if (!imageBounds || !detectedObjects.length || !initialSearchCompleted) {
    return null;
  }

  return detectedObjects.map((detectedObject, index) => (
    <vviinn-detected-object
      key={`detected-${index}`}
      detectedObject={detectedObject}
      selectedDetectedObject={selectedDetectedObject}
      basicEventData={basicEventData}
      imageBounds={imageBounds}
      showInWidget={false}
      style={{ zIndex: "10" }}
      onVviinnSelectObject={(event) => {
        event.stopPropagation();
        onSelectObject(event.detail.detectedObject, index);
      }}
    />
  ));
};

export interface SwiperProps {
  totalImages: number;
  imageUrls: string[];
  currentImageIndex: number;
  height: number;
  imageElement: HTMLImageElement;
  detectedObjects: Rectangle[];
  onSlideChange: (event: any) => void;
  onImageRef: (el: HTMLImageElement, index: number) => void;
  renderDetectedObjects: (imageIndex: number) => any;
  onNavigatePrev?: () => void;
  onNavigateNext?: () => void;
  shouldShowArrows?: boolean;
  onSwiperRef?: (el: any) => void;
  swiperKey?: string;
}

const getImageStyles = (height: number) => {
  return {
    maxWidth: "100%",
    maxHeight: `${height}px`,
    width: "auto",
    height: isDesktop() ? `${height}px` : "auto",
    objectFit: "contain" as const,
  };
};

export const renderSwiper = (props: SwiperProps) => {
  const {
    totalImages,
    imageUrls,
    currentImageIndex,
    height,
    onSlideChange,
    onImageRef,
    renderDetectedObjects,
    onNavigatePrev,
    onNavigateNext,
    shouldShowArrows = true,
    onSwiperRef,
    swiperKey,
  } = props;

  if (!imageUrls || imageUrls.length <= 1) {
    return (
      <div class="image-container">
        <img
          ref={(el: HTMLImageElement) => onImageRef(el, 0)}
          src={imageUrls?.[0] || ""}
          alt="Shop the look"
          class="main-image"
          style={getImageStyles(height)}
        />
        {renderDetectedObjects(0)}
      </div>
    );
  }

  const desktop = isDesktop();

  const swiperRef = (el: any) => {
    if (el && !el.swiper) {
      configureSwiperElement(el, {
        isDesktop: desktop,
        initialSlide: currentImageIndex,
        pagination: true,
        keyboard: true,
      });
    }
    if (onSwiperRef) {
      onSwiperRef(el);
    }
  };

  const handlePrevClick = () => {
    if (onNavigatePrev) {
      onNavigatePrev();
    }
  };

  const handleNextClick = () => {
    if (onNavigateNext) {
      onNavigateNext();
    }
  };

  const swiperStyles = getSwiperStyles(desktop);

  return (
    <div
      class={`swiper-wrapper ${desktop ? "desktop-carousel" : "mobile-slider"}`}
    >
      <swiper-container
        key={swiperKey}
        ref={swiperRef}
        onSlideChange={onSlideChange}
        style={swiperStyles}
        slides-per-view={desktop ? "auto" : "1"}
        space-between={desktop ? "20" : "0"}
        initial-slide={currentImageIndex.toString()}
        keyboard="true"
        allow-touch-move="true"
        centered-slides="false"
        pagination={!desktop ? "true" : undefined}
        pagination-clickable={!desktop ? "true" : undefined}
      >
        {imageUrls.map((url, index) => (
          <swiper-slide key={index}>
            <div class="image-container">
              <img
                ref={(el: HTMLImageElement) => onImageRef(el, index)}
                src={url}
                alt={`Shop the look ${index + 1}`}
                class="main-image"
                style={getImageStyles(height)}
              />
              {renderDetectedObjects(index)}
            </div>
          </swiper-slide>
        ))}
      </swiper-container>
      {desktop && shouldShowArrows && (
        <div class="carousel-navigation">
          <div
            class={`swiper-button-prev ${currentImageIndex === 0 ? "disabled" : ""}`}
            onClick={handlePrevClick}
          />
          <div
            class={`swiper-button-next ${currentImageIndex === totalImages - 1 ? "disabled" : ""}`}
            onClick={handleNextClick}
          />
        </div>
      )}
    </div>
  );
};

export interface ProductGridProps {
  searchResults: Recommendation[];
  onProductClick: (product: Recommendation) => void;
  onProductDetailsClick?: (product: Recommendation, index: number) => void;
}

export const renderProductGrid = (props: ProductGridProps) => {
  const { searchResults, onProductClick, onProductDetailsClick } = props;

  if (!searchResults.length) return null;

  const currentProducts = searchResults.slice(0, 4);

  return (
    <div class="search-results-grid">
      {currentProducts.map((product, index) => (
        <div
          key={`${product.productId}-${index}`}
          class="result-item"
          onClick={() => {
            if (onProductDetailsClick) {
              onProductDetailsClick(product, index);
            } else {
              onProductClick(product);
            }
          }}
        >
          <div class="result-image">
            <vviinn-image
              width={120}
              height={120}
              alt={product.title || ""}
              imageTitle={product.title || ""}
              src={product.image?.thumbnail || product.image?.original || ""}
              responsive={true}
              imageResolutionWidth={300}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export interface ProductDetailsSliderProps {
  searchResults: Recommendation[];
  currentProductIndex: number;
  currencySign?: string;
  onProductClick: (product: Recommendation) => void;
  onBackToGrid: () => void;
  onNavigateProduct: (direction: "prev" | "next") => void;
}

export const renderProductDetails = (props: ProductDetailsSliderProps) => {
  const {
    searchResults,
    currentProductIndex,
    onProductClick,
    onBackToGrid,
    currencySign,
  } = props;

  if (!searchResults.length) return null;

  const selectedProduct = searchResults[currentProductIndex];
  if (!selectedProduct) return null;

  return (
    <div class="product-details">
      <div class="product-header">
        <button class="back-to-grid-button" onClick={onBackToGrid}>
          <SecondaryActionIcon />
        </button>
      </div>

      <div class="product-content">
        <div class="product-details-card-wrapper">
          <vviinn-product-card
            class="product-details-card"
            productId={selectedProduct.productId || ""}
            productTitle={selectedProduct.title || ""}
            brand={selectedProduct.brand}
            price={selectedProduct.price.actual}
            salePrice={selectedProduct.price.sale}
            addPriceContainer={true}
            image={
              selectedProduct.image?.thumbnail ||
              selectedProduct.image?.original ||
              ""
            }
            responsive={true}
            imageResolutionWidth={300}
            currency={currencySign || ""}
            deeplink={selectedProduct.deeplink}
            onVviinnProductClick={() => onProductClick(selectedProduct)}
          />
        </div>
      </div>
    </div>
  );
};

export interface ModalProps {
  showModal: boolean;
  selectedDetectedObject: Rectangle | null;
  modalPosition: ModalPosition | null;
  searchResults: Recommendation[];
  onModalClose: (event?: Event) => void;
  onProductClick: (product: Recommendation) => void;
  showSliderView?: boolean;
  currentProductIndex?: number;
  currencySign?: string;
  onProductDetailsClick?: (product: Recommendation, index: number) => void;
  onBackToGrid?: () => void;
  onNavigateProduct?: (direction: "prev" | "next") => void;
}

export const renderModal = (props: ModalProps) => {
  const {
    showModal,
    selectedDetectedObject,
    modalPosition,
    searchResults,
    onModalClose,
    onProductClick,
    showSliderView = false,
    currentProductIndex = 0,
    onProductDetailsClick,
    onBackToGrid,
    onNavigateProduct,
    currencySign,
  } = props;

  if (!showModal || !selectedDetectedObject) return null;

  const isMobile = !isDesktop();

  let modalStyle = {};
  if (modalPosition && !isMobile) {
    modalStyle = {
      "--modal-x": `${modalPosition.x}px`,
      "--modal-y": `${modalPosition.y}px`,
    };
  }

  return (
    <div class="modal-overlay" onClick={onModalClose}>
      <div
        class={`modal-content-wrapper ${isMobile ? "mobile-modal" : "desktop-modal"}`}
        style={modalStyle}
        onClick={(e) => e.stopPropagation()}
      >
        <div class="modal-body">
          <div
            class={`product-grid-container ${showSliderView ? "hidden" : ""}`}
          >
            {searchResults.length > 0 &&
              renderProductGrid({
                searchResults,
                onProductClick,
                onProductDetailsClick,
              })}
          </div>
          <div
            class={`product-details-container ${!showSliderView ? "hidden" : ""}`}
          >
            {searchResults.length > 0 &&
              renderProductDetails({
                searchResults,
                currentProductIndex,
                onProductClick,
                currencySign,
                onBackToGrid,
                onNavigateProduct,
              })}
          </div>
        </div>
      </div>
    </div>
  );
};
