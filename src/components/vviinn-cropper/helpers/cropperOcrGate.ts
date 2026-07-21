import { ResponseDynamicFilterItem } from "../../../interfaces";
import { hasSelectedOcrFilter } from "./hasSelectedOcrFilter";

/**
 * Decides whether the cropper must be hidden because an OCR filter is active.
 * Once the user adjusts the crop box the cropper stays regardless of OCR.
 * Engagement resets whenever a different image is loaded.
 */
export class CropperOcrGate {
  private engaged = false;
  private lastImage: HTMLImageElement | null = null;
  private trustFilters = true;

  /** Re-arm OCR gating for a freshly loaded image. */
  onImage(image: HTMLImageElement | null): void {
    if (image === this.lastImage) return;
    // Re-uploads carry the previous search's filters until fresh ones arrive.
    this.trustFilters = this.lastImage === null;
    this.lastImage = image;
    this.engaged = false;
  }

  /** Fresh dynamicFilters for the current image have arrived. */
  onFreshFilters(): void {
    this.trustFilters = true;
  }

  /** Mark that the user started working with the cropper. */
  onUserAdjust(): void {
    this.engaged = true;
  }

  /** True when the cropper should be hidden. */
  isGated(dynamicFilters: ResponseDynamicFilterItem[] | undefined): boolean {
    if (!this.trustFilters) return false;
    return !this.engaged && hasSelectedOcrFilter(dynamicFilters);
  }
}
