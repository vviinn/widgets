import { h } from "@stencil/core";
import { Rectangle } from "../../interfaces/search";
import { Recommendation } from "../../interfaces/recommendation";
import { BasicEventData } from "../../recommendation/events";
import { ModalPosition } from "./helpers";
import { isDesktop, isSmallMobile } from "../../helpers/device/checkDeviceType";
import { getResponsiveImageStyles } from "../../Image/responsive";
import { configureSwiperElement, getSwiperStyles } from "../../utils/swiper/swiperUtils";

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
          src={imageUrls?.[0] || ''}
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
    <div class={`swiper-wrapper ${desktop ? 'desktop-carousel' : 'mobile-slider'}`}>
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
            class={`swiper-button-prev ${currentImageIndex === 0 ? 'disabled' : ''}`}
            onClick={handlePrevClick}
          />
          <div 
            class={`swiper-button-next ${currentImageIndex === totalImages - 1 ? 'disabled' : ''}`}
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
}

export const renderProductGrid = (props: ProductGridProps) => {
  const { searchResults, onProductClick } = props;

  if (!searchResults.length) return null;

  const currentProducts = searchResults.slice(0, 4);

  return (
    <div class="search-results-grid">
      {currentProducts.map((product, index) => (
        <div
          key={`${product.productId}-${index}`}
          class="result-item"
          onClick={() => onProductClick(product)}
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
};

export interface ModalProps {
  showModal: boolean;
  selectedDetectedObject: Rectangle | null;
  modalPosition: ModalPosition | null;
  searchResults: Recommendation[];
  onModalClose: (event?: Event) => void;
  onProductClick: (product: Recommendation) => void;
}

export const renderModal = (props: ModalProps) => {
  const {
    showModal,
    selectedDetectedObject,
    modalPosition,
    searchResults,
    onModalClose,
    onProductClick,
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
        class={`modal-content-wrapper ${isMobile ? 'mobile-modal' : 'desktop-modal'}`}
        style={modalStyle}
        onClick={(e) => e.stopPropagation()}
      >
        <div class="modal-body">
          {renderProductGrid({ searchResults, onProductClick })}
        </div>
      </div>
    </div>
  );
};
