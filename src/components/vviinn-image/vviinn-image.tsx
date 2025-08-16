import {
  Component,
  Prop,
  h,
  Element,
  State,
  Host,
  Event,
  EventEmitter,
} from "@stencil/core";
import { imageParts } from "../../cssParts";

/**
 * Encapsulated image component with customizable styling and built-in placeholder support.
 *
 * @slot placeholder-icon - Custom icon for image placeholder
 * @part image - The image element
 * @part picture - The picture element wrapper
 * @part image-container - The container wrapping the image
 * @part placeholder - The placeholder element when no image is available
 */
@Component({
  tag: "vviinn-image",
  styleUrl: "vviinn-image.css",
  shadow: true,
})
export class VviinnImage {
  @Element() host!: HTMLElement;

  @State() imageLoaded = false;
  @State() imageError = false;

  /** Emitted when image loads successfully */
  @Event() vviinnImageLoad: EventEmitter<void>;
  /** Emitted when image fails to load */
  @Event() vviinnImageError: EventEmitter<void>;

  /** Image source URL */
  @Prop() src?: string;
  /** Image width in pixels (used for aspect ratio calculation) */
  @Prop() width?: number;
  /** Image height in pixels (used for aspect ratio calculation) */
  @Prop() height?: number;
  /** Aspect ratio as a number (width/height). Overrides width/height if provided */
  @Prop() aspectRatio?: number;
  /** Image alt text */
  @Prop() alt: string = "";
  /** Image title attribute */
  @Prop() imageTitle: string = "";
  /** Whether to enable responsive behavior (width: 100%, height: auto) */
  @Prop() responsive: boolean = false;
  /** Whether to fill the full height of the container */
  @Prop() fullHeight: boolean = false;
  /** Image processing width for URL optimization */
  @Prop() imageResolutionWidth?: number;
  /** How the image should fit within its container */
  @Prop() objectFit: "contain" | "cover" | "fill" | "none" | "scale-down" =
    "contain";
  /** Whether to show loading state with skeleton animation */
  @Prop() loading: boolean = false;
  /** Whether component is in set mode shows sparkle icon in loading state */
  @Prop() showSkeletonIcon: boolean = false;
  /** Custom CSS classes to apply */
  @Prop() customClass: string = "";
  /** Border radius (can use CSS custom properties) */
  @Prop() borderRadius: string = "";
  /** Border (applied to image container) */
  @Prop() border: string = "";
  /** Background color (applied to image container) */
  @Prop() backgroundColor: string = "";
  /** Ref callback for the image element */
  @Prop() imageRef?: (el: HTMLImageElement | null) => void;
  /** Callback for when image loading ends (load or error) */
  @Prop() loadEndCallback?: () => void;

  private getProcessedSrc(): string {
    if (!this.src) return "";

    if (this.imageResolutionWidth) {
      const fitExpr = /fit\/\d+\//;
      return this.src.match(fitExpr)
        ? this.src.replace(fitExpr, `fit/${this.imageResolutionWidth}/`)
        : this.src;
    }

    return this.src;
  }

  private getDimensionStyles() {
    const styles: Record<string, string> = {};

    if (this.aspectRatio) {
      styles.aspectRatio = this.aspectRatio.toString();
    } else if (this.width && this.height) {
      if (!this.responsive) {
        styles.width = `${this.width}px`;
        styles.height = `${this.height}px`;
      } else {
        styles.aspectRatio = (this.width / this.height).toString();
      }
    }

    if (this.borderRadius) styles.borderRadius = this.borderRadius;
    if (this.border) styles.border = this.border;
    if (this.backgroundColor) styles.backgroundColor = this.backgroundColor;

    return styles;
  }

  private getImageClasses(): string {
    let classes = "image";
    if (this.responsive) classes += " responsive";
    if (this.fullHeight) classes += " full-height content-card-image";
    if (this.loading) classes += " loading";
    if (this.imageLoaded) classes += " loaded";
    if (this.imageError) classes += " error";
    if (this.customClass) classes += " " + this.customClass;
    return classes;
  }

  private handleImageLoad = (event: Event) => {
    const imgElement = event.target as HTMLImageElement;
    this.imageLoaded = true;
    this.vviinnImageLoad.emit();

    if (this.imageRef) {
      this.imageRef(imgElement);
    }

    if (this.loadEndCallback) {
      this.loadEndCallback();
    }
  };

  private handleImageError = () => {
    this.imageError = true;
    this.vviinnImageError.emit();

    if (this.imageRef) {
      this.imageRef(null);
    }

    if (this.loadEndCallback) {
      this.loadEndCallback();
    }
  };

  private renderImage() {
    const processedSrc = this.getProcessedSrc();
    const hasImage = !!processedSrc && !this.imageError;

    if (hasImage) {
      return (
        <img
          src={processedSrc}
          alt={this.alt}
          title={this.imageTitle}
          class={this.getImageClasses()}
          part={`image ${this.fullHeight ? "content-card-image" : ""}`}
          style={{
            objectFit: this.objectFit,
            ...(!this.responsive && this.width
              ? { width: `${this.width}px` }
              : {}),
            ...(!this.responsive && this.height
              ? { height: `${this.height}px` }
              : {}),
          }}
          onLoad={this.handleImageLoad}
          onError={this.handleImageError}
          loading="lazy"
        />
      );
    }

    return null;
  }

  render() {
    const containerStyles = this.getDimensionStyles();

    return (
      <Host
        exportparts={imageParts}
        class={{ "has-skeleton-icon": this.showSkeletonIcon }}
      >
        <div
          class={`image-container ${this.fullHeight ? "content-card-image-container" : ""}`}
          part={`image-container ${this.fullHeight ? "content-card-image-container" : ""}`}
          style={containerStyles}
        >
          <picture
            part={`image-picture ${this.fullHeight ? "content-card-image-picture" : ""}`}
          >
            {this.renderImage()}
          </picture>
          {this.loading && !this.imageLoaded && (
            <div
              class="image-skeleton"
              part="image-skeleton"
              style={{
                "aspect-ratio": this.aspectRatio
                  ? this.aspectRatio.toString()
                  : this.width && this.height
                    ? (this.width / this.height).toString()
                    : "1",
              }}
            >
              <vviinn-skeleton />
            </div>
          )}
        </div>
      </Host>
    );
  }
}
