import {
  Component,
  Host,
  h,
  Prop,
  Listen,
  State,
  Element,
  Event,
  EventEmitter,
} from "@stencil/core";
import { existAndNotEmpty } from "../../utils/collections/collectionsUtils";
import { createBearerHeaders } from "../../utils/token/tokenUtils";
import { NetworkError, networkErrorFrom } from "../../network/request";
import {
  readFilters,
  SearchSessionFilter,
  SearchSessionFilters,
  searchSessionClient,
  IonSearchSession,
  DetectedObject,
} from "../../searchSession/searchSession";
import { Recommendation } from "../../recommendation/recommendation";
import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";
import * as O from "fp-ts/Option";
import { pipe } from "fp-ts/function";
import {
  getLink,
  foldIonItem,
  IonItem,
  IonLink,
  linkRequest,
} from "../../network/ionClient";

import { Rectangle, fromAlt } from "../../geometry/Rectangle";
import state from "../../store/store";

const composeData = (
  token: string,
  file: File
): E.Either<NetworkError, RequestInit> =>
  pipe(
    token,
    existAndNotEmpty,
    E.map((token) => {
      const body = new FormData();
      body.append("image", file);
      return {
        headers: createBearerHeaders(token),
        body,
      };
    }),
    E.mapLeft(networkErrorFrom)
  );

const composeRectangleData = (
  token: string,
  rectangle: Rectangle
): E.Either<NetworkError, RequestInit> =>
  pipe(
    token,
    existAndNotEmpty,
    E.map((token) => {
      const data = {
        left: rectangle.x,
        top: rectangle.y,
        width: rectangle.width,
        height: rectangle.height,
      };
      const body = JSON.stringify(data);
      const headers = createBearerHeaders(token);
      headers.append("content-type", "application/json");
      return {
        headers,
        body,
      };
    }),
    E.mapLeft(networkErrorFrom)
  );

const composeAuth = (token: string): E.Either<NetworkError, RequestInit> =>
  pipe(
    token,
    existAndNotEmpty,
    E.map((token) => {
      return {
        headers: createBearerHeaders(token),
      };
    }),
    E.mapLeft(networkErrorFrom)
  );

@Component({
  tag: "image-search",
  styleUrl: "image-search.css",
  shadow: true,
})
export class ImageSearch {
  /** Mediaopt customer token */
  @Prop() token: string;
  /** Currency sign will shown after price */
  @Prop() currencySign: string;

  @Event({ bubbles: true }) objectsDetected: EventEmitter<
    IonItem<DetectedObject>[]
  >;
  @Event({ bubbles: true }) toggleCropping: EventEmitter<boolean>;

  @State() loading: boolean = false;
  @State() imageSelected: boolean = false;
  @State() showCropper: boolean = false;
  @State() showDetectedObjects: boolean = false;
  @State() products: Recommendation[] = [];
  @State() filters: SearchSessionFilter[] = [];
  @State() rectangleSearchLink: O.Option<IonLink> = O.none;
  @State() clearFiltersLink: O.Option<IonLink> = O.none;

  private slider: HTMLVprSliderElement;
  private cropArea: Rectangle | undefined = undefined;

  @Element() el: HTMLElement;

  @Listen("filterSelectedEvent")
  handleFilterSelection({ detail }: CustomEvent<IonLink>) {
    this.handleRecommendationsLink(detail);
  }

  @Listen("imageSelected")
  async handleImageSelect({ detail }: CustomEvent<File>) {
    this.loading = true;
    this.imageSelected = true;

    const request = await pipe(
      composeData(this.token, detail),
      TE.fromEither,
      TE.map(searchSessionClient),
      TE.flatten
    )();

    pipe(
      request,
      E.fold(
        (e: NetworkError) => this.handleSearchError(e),
        (data: IonSearchSession) => this.processSearchRequest(data)
      )
    );
  }

  componentWillLoad() {
    state.currencySign = this.currencySign;
  }

  @Listen("detectedObjectSelected")
  handleDetectedObjectSelected({
    detail,
  }: CustomEvent<IonItem<DetectedObject>>) {
    pipe(
      getLink(detail, "rectangle"),
      O.map((link) => {
        const rectangle = fromAlt(foldIonItem(detail).rectangle);

        return this.createRectangleRequest(link, rectangle);
      })
    );
  }

  private async handleRecommendationsLink(link: IonLink) {
    this.loading = true;

    const request = await pipe(
      composeAuth(this.token),
      TE.fromEither,
      TE.map(linkRequest(link)),
      TE.flatten
    )();

    pipe(
      request,
      E.fold(
        (e: NetworkError) => this.handleSearchError(e),
        (data: IonSearchSession) => this.processSearchRequest(data)
      )
    );
  }

  private async processSearchRequest(data: IonSearchSession) {
    this.loading = false;
    this.showDetectedObjects = false;
    await this.slider.resetSliderPosition();
    this.handleSearchSuccess(data.value);
    this.renderFilters(data.filters);
    this.renderDetectedObjects(data.detectedObjects);
    this.rectangleSearchLink = getLink(data, "rectangle");
    this.clearFiltersLink = getLink(data, "clearFilters");
  }

  private renderDetectedObjects(detectedObjects: IonItem<DetectedObject>[]) {
    this.objectsDetected.emit(detectedObjects);
    if (!this.showCropper && detectedObjects.length > 0)
      this.showDetectedObjects = true;
  }

  private renderFilters(filters: IonItem<SearchSessionFilters>) {
    this.filters = readFilters(foldIonItem(filters));
  }

  private handleSearchError(_error: NetworkError) {
    this.loading = false;
  }

  async handleSearchSuccess(data: Recommendation[]) {
    await this.slider.loadProducts(data);
  }

  private async toggleCropper() {
    this.showCropper = !this.showCropper;
    this.toggleCropping.emit(this.showCropper);
  }

  private async cropImage() {
    pipe(
      this.rectangleSearchLink,
      O.map((link) => this.createRectangleRequest(link, this.cropArea))
    );
  }

  private async createRectangleRequest(link: IonLink, selection: Rectangle) {
    this.loading = true;

    const request = await pipe(
      composeRectangleData(this.token, selection),
      TE.fromEither,
      TE.map(linkRequest(link)),
      TE.flatten
    )();

    pipe(
      request,
      E.fold(
        (e: NetworkError) => this.handleSearchError(e),
        (data: IonSearchSession) => this.processSearchRequest(data)
      )
    );
  }

  private clearFilters() {
    pipe(
      this.clearFiltersLink,
      O.map((filterLink) => this.handleRecommendationsLink(filterLink))
    );
  }

  render() {
    return (
      <Host>
        <image-selector
          part="image-selector"
          exportparts="drop-zone, button"
          class={{ active: !this.imageSelected }}
        >
          <slot slot="upload-button-text" name="upload-button-text">
            Click to select files
          </slot>
          <slot slot="upload-error-text" name="upload-error-text">
            Use only image files!
          </slot>
          <slot name="drop-helper-text">or drop files here</slot>
        </image-selector>
        <div class="image-view" part={this.imageSelected ? "image-view" : ""}>
          <image-view
            class={{
              hidden: !this.imageSelected,
            }}
            onCropAreaChanged={({ detail }: CustomEvent<Rectangle>) =>
              (this.cropArea = detail)
            }
          />
        </div>
        {O.isSome(this.rectangleSearchLink) ? (
          <div class="cropper-controls" part="controls">
            <button part="button" onClick={() => this.toggleCropper()}>
              {this.showCropper ? "hide cropper" : "show cropper"}
            </button>
            {this.showCropper ? (
              <button part="button" onClick={() => this.cropImage()}>
                crop region
              </button>
            ) : null}
          </div>
        ) : null}
        {this.filters.map((f) => (
          <search-filters filter={f} part="filters" />
        ))}
        {O.isSome(this.clearFiltersLink) ? (
          <button onClick={() => this.clearFilters()}>Clear filters</button>
        ) : null}
        <vpr-slider
          part="results"
          mode="grid"
          productsInGrid={16}
          imageWidth={100}
          imageRatio={1}
          ref={(el) => (this.slider = el)}
        ></vpr-slider>
        <slot name="teaser">
          Upload image using button above. Then you can specify results by
          selecting detected objects, cropping or filtering by results
          categories.
        </slot>
        {this.loading ? (
          <slot name="loader">
            <div class="loader">
              <div class="loader_cover"></div>
              <div class="loader_message">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path
                    d="M221.09 64a157.09 157.09 0 10157.09 157.09A157.1 157.1 0 00221.09 64z"
                    fill="none"
                    stroke="currentColor"
                    stroke-miterlimit="10"
                    stroke-width="32"
                  />
                  <path
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-miterlimit="10"
                    stroke-width="32"
                    d="M338.29 338.29L448 448"
                  />
                </svg>
                <span>Searching for products...</span>
              </div>
            </div>
          </slot>
        ) : null}
      </Host>
    );
  }
}
