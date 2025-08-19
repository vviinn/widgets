import { Rectangle, Recommendation } from "../../interfaces";
import { calculateImageBounds } from "./helpers";

export interface ImageState {
  detectedObjects: Rectangle[];
  searchCompleted: boolean;
  searchResults: Recommendation[];
  isVisible: boolean;
  imageElement: HTMLImageElement | null;
  imageBounds: Rectangle | null;
  visualSearchId: string | null;
  searchTriggered: boolean;
  observerSetup: boolean;
  refProcessed: boolean;
  observer?: IntersectionObserver;
}

export interface ObserverConfig {
  threshold: number;
  token: string;
  isIntersecting: boolean;
  totalImages: number;
  onImageVisibilityChange: () => void;
  onVisualSearchTrigger: (index: number) => void;
}

export const createDefaultImageState = (
  imageElement?: HTMLImageElement | null,
): ImageState => ({
  detectedObjects: [],
  searchCompleted: false,
  searchResults: [],
  isVisible: false,
  imageElement: imageElement || null,
  imageBounds: null,
  visualSearchId: null,
  searchTriggered: false,
  observerSetup: false,
  refProcessed: false,
});

export class ShopTheLookImageStore {
  private imageStates: Map<number, ImageState> = new Map();
  private config: ObserverConfig;

  constructor(config: ObserverConfig) {
    this.config = config;
  }

  updateConfig(updates: Partial<ObserverConfig>) {
    this.config = { ...this.config, ...updates };
  }

  getImageState(index: number): ImageState {
    if (!this.imageStates.has(index)) {
      this.imageStates.set(index, createDefaultImageState());
    }
    return this.imageStates.get(index)!;
  }

  updateImageState(index: number, updates: Partial<ImageState>) {
    const state = this.getImageState(index);
    Object.assign(state, updates);
    this.imageStates.set(index, state);
  }

  setupImageIntersectionObserver(element: HTMLImageElement, index: number) {
    const state = this.getImageState(index);
    if (state.observerSetup) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const isVisible = entry.intersectionRatio >= this.config.threshold;
          this.updateImageVisibility(index, isVisible);
        });
      },
      {
        threshold: this.config.threshold,
        root: null,
        rootMargin: "0px",
      },
    );

    observer.observe(element);
    this.updateImageState(index, { observer, observerSetup: true });
  }

  private updateImageVisibility(index: number, isVisible: boolean) {
    const currentState = this.getImageState(index);
    const wasVisible = currentState.isVisible;
    const stateChanged = wasVisible !== isVisible;

    if (!stateChanged) return;

    if (isVisible && currentState.imageElement && !currentState.imageBounds) {
      currentState.imageBounds = calculateImageBounds(
        currentState.imageElement,
      );
    }

    this.updateImageState(index, { isVisible });

    // Notify parent component of visibility change
    this.config.onImageVisibilityChange();

    if (this.shouldTriggerSearch(index, isVisible, wasVisible, currentState)) {
      this.updateImageState(index, { searchTriggered: true });
      this.config.onVisualSearchTrigger(index);
    }
  }

  private shouldTriggerSearch(
    _index: number,
    isVisible: boolean,
    wasVisible: boolean,
    currentState: ImageState,
  ): boolean {
    // Check all conditions for triggering a visual search
    const isNewlyVisible = isVisible && wasVisible === false;
    const hasRequiredTokenAndState =
      this.config.isIntersecting && this.config.token;
    const isSearchEligible =
      !currentState.searchCompleted && !currentState.searchTriggered;
    const hasCapacityForMoreSearches =
      this.getTriggeredSearchCount() < this.config.totalImages;

    return (
      isNewlyVisible &&
      hasRequiredTokenAndState &&
      isSearchEligible &&
      hasCapacityForMoreSearches
    );
  }

  private getTriggeredSearchCount(): number {
    return Array.from(this.imageStates.values()).filter(
      (state) => state.searchTriggered,
    ).length;
  }

  setImageElement(index: number, element: HTMLImageElement) {
    this.updateImageState(index, { imageElement: element });
  }

  getImageElement(index: number): HTMLImageElement | null {
    return this.getImageState(index).imageElement;
  }

  /**
   * Replace entire image state (use sparingly)
   */
  setImageState(index: number, state: ImageState) {
    this.imageStates.set(index, state);
  }

  updateImageStateData(
    index: number,
    detectedObjects: Rectangle[],
    searchCompleted: boolean,
    searchResults: Recommendation[],
    visualSearchId?: string | null,
  ) {
    const updates: Partial<ImageState> = {
      detectedObjects,
      searchCompleted,
      searchResults,
    };

    if (visualSearchId !== undefined) {
      updates.visualSearchId = visualSearchId;
    }

    this.updateImageState(index, updates);
  }

  disconnectAll() {
    this.imageStates.forEach((state) => {
      if (state.observer) {
        state.observer.disconnect();
      }
    });
    this.imageStates.clear();
  }

  getAllImageStates(): Map<number, ImageState> {
    return new Map(this.imageStates);
  }

  /**
   * Check if an image state exists for the given index
   */
  hasImageState(index: number): boolean {
    return this.imageStates.has(index);
  }

  /**
   * Check if any images are currently searching (triggered but not completed)
   */
  hasActiveSearches(): boolean {
    return Array.from(this.imageStates.values()).some(state => 
      state.searchTriggered && !state.searchCompleted
    );
  }

}
