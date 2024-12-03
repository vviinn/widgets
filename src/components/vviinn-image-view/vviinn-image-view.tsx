import { Component, Host, h, Prop, State, Element } from "@stencil/core";
import { pipe } from "fp-ts/lib/function";
import * as O from "fp-ts/lib/Option";
import Cropper from "cropperjs";

import {
  searchState,
  makeRectangularSearchRequest,
} from "../../store/search.store";
import { sequenceToOption } from "../../utils/option/option";
import { dimensionsFromImage, scaleByLargestSide } from "../../Image/sizing";
import styles from "./vviinn-image-view.css";
import { BasicEventData } from "../../recommendation/events";
import { LoadImageEventData, SearchArea } from "../vviinn-cropper/types";

const DEFAULT_IMAGE_SIZE = 288;

const getImageSizes = (i: HTMLImageElement): [number, number] => {
  const dimensions = dimensionsFromImage(i);
  const resize = scaleByLargestSide(DEFAULT_IMAGE_SIZE);
  const newDimensions = resize(dimensions);

  const sizes = newDimensions.map((d) => d.size);
  return [sizes[0], sizes[1]];
};

@Component({
  tag: "vviinn-image-view",
  shadow: true,
  styles,
})
export class VviinnImageView {
  @Element() el: HTMLElement;

  @Prop() basicEventData: BasicEventData;
  @Prop() setShowAspectRatioError: (isError: boolean) => void;
  @Prop() showAspectRatioError: boolean;

  @State() url: string;
  @State() width: number;
  @State() height: number;
  @State() cropper: Cropper = null;
  @State() hidePreloader = false;

  componentWillRender() {
    this.renderImage();
  }

  connectedCallback() {
    document.addEventListener(
      "vviinnCropperLoadImage",
      this.vviinnCropperLoadImage
    );
    document.addEventListener(
      "vviinnCropperAspectRatioError",
      this.vviinnCropperAspectRatioError
    );
    document.addEventListener(
      "vviinnCropperHidePreloader",
      this.vviinnCropperHidePreloader
    );
    document.addEventListener(
      "vviinnCropperCropEnd",
      this.vviinnCropperCropEnd
    );
  }

  disconnectedCallback() {
    document.removeEventListener(
      "vviinnCropperLoadImage",
      this.vviinnCropperLoadImage
    );
    document.removeEventListener(
      "vviinnCropperAspectRatioError",
      this.vviinnCropperAspectRatioError
    );
    document.removeEventListener(
      "vviinnCropperHidePreloader",
      this.vviinnCropperHidePreloader
    );
    document.removeEventListener(
      "vviinnCropperCropEnd",
      this.vviinnCropperCropEnd
    );
  }

  vviinnCropperLoadImage({ detail }: CustomEvent<LoadImageEventData>) {
    searchState.imageBounds = O.some(detail.imageBounds);
    searchState.searchArea = O.some(detail.searchArea);
  }
  vviinnCropperCropEnd({ detail }: CustomEvent<SearchArea>) {
    searchState.searchArea = O.some(detail);
    makeRectangularSearchRequest();
    searchState.detectedObject = undefined;
  }
  vviinnCropperAspectRatioError({ detail }: CustomEvent<boolean>) {
    this.setShowAspectRatioError(detail);
    this.el.classList.add("bordered");
  }
  vviinnCropperHidePreloader({ detail }: CustomEvent<boolean>) {
    this.el.classList.add("bordered");
    this.hidePreloader = detail;
  }

  private renderImage(): null {
    return pipe(
      sequenceToOption(searchState.imageUrl, searchState.image),
      O.map(([url, refImage]) => {
        const [width, height] = getImageSizes(refImage);

        this.width = width;
        this.height = height;
        this.url = url;
      }),
      O.getOrElse(() => null)
    );
  }

  render() {
    return (
      <Host>
        <div class="container">
          <vviinn-cropper
            width={this.width}
            height={this.height}
            url={this.url}
            detectedObjects={searchState.detectedObjects}
            basicEventData={this.basicEventData}
          />

          {(searchState.loading || searchState.objectDetectionInProgress) &&
          !this.showAspectRatioError &&
          !this.hidePreloader ? (
            <div class="image-preloader">
              <vviinn-preloader />
            </div>
          ) : null}
        </div>
      </Host>
    );
  }
}
