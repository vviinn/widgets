import { h } from "@stencil/core";
import { Rectangle } from "../../interfaces/search";
import { Recommendation } from "../../interfaces/recommendation";
import { BasicEventData } from "../../recommendation/events";
import { ModalPosition } from "./helpers";
import { isDesktop, isSmallMobile } from "../../helpers/device/checkDeviceType";
import { getResponsiveImageStyles } from "../../Image/responsive";
import {
  configureSwiperElement,
  getSwiperStyles,
} from "../../utils/swiper/swiperUtils";
import { GridViewIcon } from "../vviinn-icons/icons/GridViewIcon";
import { UniversalImage } from "../vviinn-product-card/render-helpers";

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
  width: number;
  height: number;
  imageElement: HTMLImageElement;
  detectedObjects: Rectangle[];
  onSlideChange: (event: any) => void;
  onImageRef: (el: HTMLImageElement, index: number) => void;
  renderDetectedObjects: (imageIndex: number) => any;
  onNavigatePrev?: () => void;
  onNavigateNext?: () => void;
  shouldShowArrows?: boolean;
}

const getImageStyles = (width: number, height: number) => {
  return getResponsiveImageStyles(width, height, isSmallMobile());
};

export const renderSwiper = (props: SwiperProps) => {
  const {
    totalImages,
    imageUrls,
    currentImageIndex,
    width,
    height,
    onSlideChange,
    onImageRef,
    renderDetectedObjects,
    onNavigatePrev,
    onNavigateNext,
    shouldShowArrows = true,
  } = props;

  if (!imageUrls || imageUrls.length <= 1) {
    return (
      <div class="image-container">
        <img
          ref={(el: HTMLImageElement) => onImageRef(el, 0)}
          src={imageUrls?.[0] || ""}
          alt="Shop the look"
          class="main-image"
          style={getImageStyles(width, height)}
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
                style={getImageStyles(width, height)}
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
            {UniversalImage({
              width: 120,
              height: 120,
              title: product.title || "",
              src: product.image?.thumbnail || product.image?.original || "",
              ref: () => {},
              isResponsive: true,
              imageResolutionWidth: 300,
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export interface ProductDetailsSliderProps {
  searchResults: Recommendation[];
  currentProductIndex: number;
  onProductClick: (product: Recommendation) => void;
  onBackToGrid: () => void;
  onNavigateProduct: (direction: "prev" | "next") => void;
}

export const renderProductDetailsSlider = (
  props: ProductDetailsSliderProps,
) => {
  const {
    searchResults,
    currentProductIndex,
    onProductClick,
    onBackToGrid,
    onNavigateProduct,
  } = props;

  if (!searchResults.length) return null;

  const isDesktopView = isDesktop();

  const swiperRef = (el: any) => {
    if (el && !el.swiper) {
      configureSwiperElement(el, {
        isDesktop: isDesktopView,
        initialSlide: currentProductIndex,
        pagination: true,
        keyboard: true,
      });
    }
  };

  const handleSlideChange = (event: any) => {
    const activeIndex =
      event.detail?.[0]?.activeIndex ?? event.target?.swiper?.activeIndex;
    if (activeIndex !== undefined && activeIndex !== currentProductIndex) {
      onNavigateProduct(activeIndex > currentProductIndex ? "next" : "prev");
    }
  };

  return (
    <div class="product-details-slider">
      <div class="slider-header">
        <button class="back-to-grid-button" onClick={onBackToGrid}>
          <GridViewIcon />
        </button>
      </div>

      <div class="slider-content">
        <swiper-container
          ref={swiperRef}
          onSlideChange={handleSlideChange}
          slides-per-view="1"
          space-between="0"
          initial-slide={currentProductIndex.toString()}
          keyboard="true"
          allow-touch-move="true"
          pagination="true"
          pagination-clickable="true"
        >
          {searchResults.map((product, index) => (
            <swiper-slide key={`${product.productId}-${index}`}>
              <div class="product-details-card-wrapper">
                <vviinn-product-card
                  class="product-details-card"
                  productId={product.productId || ""}
                  productTitle={product.title || ""}
                  brand={product.brand}
                  price={product.price.actual}
                  salePrice={product.price.sale}
                  currency="€"
                  locale="en"
                  image={
                    product.image?.thumbnail || product.image?.original || ""
                  }
                  imageWidth={220}
                  imageRatio={0.9}
                  imageResolutionWidth={150}
                  deeplink={product.deeplink}
                  responsive={true}
                  addToBasketShow={false}
                  favoriteShow={false}
                  onVviinnProductClick={() => onProductClick(product)}
                />
              </div>
            </swiper-slide>
          ))}
        </swiper-container>
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
        class={`modal-content-wrapper ${isMobile ? "mobile-modal" : "desktop-modal"} ${showSliderView ? "slider-view" : ""}`}
        style={modalStyle}
        onClick={(e) => e.stopPropagation()}
      >
        <div class="modal-body">
          {showSliderView
            ? renderProductDetailsSlider({
                searchResults,
                currentProductIndex,
                onProductClick,
                onBackToGrid: onBackToGrid || (() => {}),
                onNavigateProduct: onNavigateProduct || (() => {}),
              })
            : renderProductGrid({
                searchResults,
                onProductClick,
                onProductDetailsClick,
              })}
        </div>
      </div>
    </div>
  );
};
