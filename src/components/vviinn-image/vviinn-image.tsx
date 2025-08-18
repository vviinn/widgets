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

  private get isLoading(): boolean {
    return this.loading && !this.imageLoaded && !this.imageError;
  }

  private get hasValidImage(): boolean {
    return !!this.src && !this.imageError;
  }

  private get computedAspectRatio(): number | null {
    if (this.aspectRatio) return this.aspectRatio;
    if (this.width && this.height) return this.width / this.height;
    return null;
  }

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

  private getDimensionStyles(): Record<string, string> {
    const styles: Record<string, string> = {};
    const aspectRatio = this.computedAspectRatio;

    if (aspectRatio) {
      if (this.responsive) {
        styles.aspectRatio = aspectRatio.toString();
      } else {
        styles.width = this.width ? `${this.width}px` : "auto";
        styles.height = this.height ? `${this.height}px` : "auto";
      }
    }

    return styles;
  }

  private getContainerStyles(): Record<string, string> {
    const styles = this.getDimensionStyles();

    if (this.borderRadius) styles.borderRadius = this.borderRadius;
    if (this.border) styles.border = this.border;
    if (this.backgroundColor) styles.backgroundColor = this.backgroundColor;

    return styles;
  }

  private getImageStyles(): Record<string, string> {
    const styles: Record<string, string> = {
      objectFit: this.objectFit,
    };

    if (!this.responsive) {
      if (this.width) styles.width = `${this.width}px`;
      if (this.height) styles.height = `${this.height}px`;
    }

    return styles;
  }

  private getImageClassMap() {
    return {
      image: true,
      responsive: this.responsive,
      "full-height": this.fullHeight,
      "content-card-image": this.fullHeight,
      loading: this.isLoading,
      loaded: this.imageLoaded,
      error: this.imageError,
      [this.customClass]: !!this.customClass,
    };
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

    if (!this.hasValidImage || !processedSrc) {
      return null;
    }

    return (
      <img
        src={processedSrc}
        alt={this.alt}
        title={this.imageTitle}
        class={this.getImageClassMap()}
        part={`image ${this.fullHeight ? "content-card-image" : ""}`}
        style={this.getImageStyles()}
        onLoad={this.handleImageLoad}
        onError={this.handleImageError}
        loading="lazy"
      />
    );
  }

  private renderSkeleton() {
    if (!this.isLoading) return null;

    const aspectRatio = this.computedAspectRatio || 1;

    return (
      <div
        class="image-skeleton"
        part="image-skeleton"
        style={{ "aspect-ratio": aspectRatio.toString() }}
      >
        <vviinn-skeleton />
      </div>
    );
  }

  render() {
    return (
      <Host
        exportparts={imageParts}
        class={{ "has-skeleton-icon": this.showSkeletonIcon }}
      >
        <div
          class={`image-container${this.fullHeight ? " content-card-image-container" : ""}`}
          part={`image-container${this.fullHeight ? " content-card-image-container" : ""}`}
          style={this.getContainerStyles()}
        >
          <picture
            part={`image-picture${this.fullHeight ? " content-card-image-picture" : ""}`}
          >
            {this.renderImage()}
          </picture>
          {this.renderSkeleton()}
        </div>
      </Host>
    );
  }
}
