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
  private awaitingFilters = false;

  /** Re-arm OCR gating for a freshly loaded image. */
  onImage(image: HTMLImageElement | null): void {
    if (image === this.lastImage) return;
    this.lastImage = image;
    this.engaged = false;
    this.awaitingFilters = true;
  }

  /** Fresh dynamicFilters for the current image have arrived. */
  onFreshFilters(): void {
    this.awaitingFilters = false;
  }

  /** Mark that the user started working with the cropper. */
  onUserAdjust(): void {
    this.engaged = true;
  }

  /** True when the cropper should be hidden. */
  isGated(
    dynamicFilters: ResponseDynamicFilterItem[] | undefined,
    isSearchLoading = false,
  ): boolean {
    // Defer while the image's search is still resolving, to avoid a flash.
    if (this.awaitingFilters && isSearchLoading) return true;
    return !this.engaged && hasSelectedOcrFilter(dynamicFilters);
  }
}
