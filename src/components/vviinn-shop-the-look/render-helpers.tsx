import { h } from "@stencil/core";
import { Rectangle } from "../../interfaces/search";
import { Recommendation } from "../../interfaces/recommendation";
import { BasicEventData } from "../../recommendation/events";
import { ModalPosition } from "./helpers";
import { Pagination } from "swiper/modules";

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
  renderDetectedObjects: () => any;
}

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
  } = props;

  if (totalImages <= 1) {
    return (
      <div class="image-container">
        <img
          ref={(el: HTMLImageElement) => onImageRef(el, currentImageIndex)}
          src={imageUrls[currentImageIndex]}
          alt="Shop the look"
          class="main-image"
          style={{
            width: `${width}px`,
            height: `${height}px`,
          }}
        />
        {renderDetectedObjects()}
      </div>
    );
  }

  const swiperRef = (el: any) => {
    if (el && !el.swiper) {
      // Configure swiper with modules
      Object.assign(el, {
        modules: [Pagination],
        pagination: {
          clickable: true,
        },
        navigation: false,
        scrollbar: false,
        keyboard: true,
        mousewheel: false,
        allowTouchMove: true,
        initialSlide: currentImageIndex,
      });
    }
  };

  return (
    <swiper-container
      ref={swiperRef}
      onSlideChange={onSlideChange}
      style={{
        '--swiper-pagination-color': '#8d8d8d',
        '--swiper-pagination-bullet-inactive-color': 'rgba(22, 22, 22, 0.25)',
        '--swiper-pagination-bullet-size': '8px',
        '--swiper-pagination-bullet-horizontal-gap': '8px',
        '--swiper-pagination-bottom': '20px',
      }}
    >
      {imageUrls.map((url, index) => (
        <swiper-slide key={index}>
          <div class="image-container">
            <img
              ref={(el: HTMLImageElement) => onImageRef(el, index)}
              src={url}
              alt={`Shop the look ${index + 1}`}
              class="main-image"
              style={{
                width: `${width}px`,
                height: `${height}px`,
              }}
            />
            {index === currentImageIndex && renderDetectedObjects()}
          </div>
        </swiper-slide>
      ))}
    </swiper-container>
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

  const modalStyle = modalPosition
    ? {
        "--modal-x": `${modalPosition.x}px`,
        "--modal-y": `${modalPosition.y}px`,
      }
    : {};

  return (
    <div class="modal-overlay" onClick={onModalClose}>
      <div
        class="modal-content-wrapper"
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
