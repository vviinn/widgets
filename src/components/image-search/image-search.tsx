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
  SearchSession,
  DetectedObject,
} from "../../searchSession/searchSession";
import { Recommendation } from "../../recommendation/recommendation";
import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";
import * as O from "fp-ts/Option";
import { pipe } from "fp-ts/function";

import { foldValueObject, ValueObject } from "../../network/ion/ValueObject";
import { Form, formRequest } from "../../network/ion/Form";
import { Link, getLink, linkRequest } from "../../network/ion/Link";

import { Rectangle } from "../../geometry/Rectangle";
import state from "../../store/store";
import { RectangleAlt } from "../../geometry/RectangleAlt";

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
    ValueObject<DetectedObject>[]
  >;
  @Event({ bubbles: true }) resetSearchArea: EventEmitter<void>;
  @Event({ bubbles: true }) filtersCleared: EventEmitter<void>;

  @State() loading: boolean = false;
  @State() imageSelected: boolean = false;
  @State() products: Recommendation[] = [];
  @State() filters: SearchSessionFilter[] = [];
  @State() rectangleSearchForm: Form | undefined;
  @State() clearFiltersLink: O.Option<Link> = O.none;
  @State() isSearchAreaChanged: boolean = false;

  private slider: HTMLVprSliderElement;
  private cropArea: Rectangle | undefined = undefined;

  @Element() el: HTMLElement;

  @Listen("filterSelectedEvent")
  handleFilterSelection({ detail }: CustomEvent<Link>) {
    this.linkRequest(detail);
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
        (data: SearchSession) => this.processSearchRequest(data)
      )
    );
  }

  @Listen("searchAreaChangeStart")
  handleSearchAreaRelease({ detail }: CustomEvent<boolean>) {
    if (detail) {
      this.isSearchAreaChanged = true;
      return;
    } else {
      this.cropImage();
    }
  }

  @Listen("detectedObjectSelected")
  handleDetectedObjectSelected({
    detail,
  }: CustomEvent<ValueObject<DetectedObject>>) {
    this.isSearchAreaChanged = true;
    pipe(
      getLink(detail, "rectangle"),
      O.map((link) => {
        return this.linkRequest(link);
      })
    );
  }

  componentWillLoad() {
    state.currencySign = this.currencySign;
  }

  private async processSearchRequest(data: SearchSession) {
    this.loading = false;
    await this.slider.resetSliderPosition();
    this.handleSearchSuccess(data.value);
    this.renderFilters(data.filters);
    this.rectangleSearchForm = data.searchArea;
    this.clearFiltersLink = getLink(data, "clearFilters");

    pipe(
      O.fromNullable(data.detectedObjects),
      O.map((objects) => this.renderDetectedObjects(objects))
    );

    pipe(
      getLink(data, "detectObjects"),
      O.map((link) => this.linkRequest(link))
    );
  }

  private renderDetectedObjects(
    detectedObjects: ValueObject<DetectedObject>[]
  ) {
    this.objectsDetected.emit(detectedObjects);
  }

  private renderFilters(filters: ValueObject<SearchSessionFilters>) {
    this.filters = readFilters(foldValueObject(filters));
  }

  private handleSearchError(_error: NetworkError) {
    this.loading = false;
  }

  async handleSearchSuccess(data: Recommendation[]) {
    await this.slider.loadProducts(data);
  }

  private cropImage() {
    const data = {
      ...this.cropArea,
      left: this.cropArea.x,
      top: this.cropArea.y,
    };

    this.rectangleFormRequest(this.rectangleSearchForm, data);
  }

  private async rectangleFormRequest(form: Form, rectangle: RectangleAlt) {
    this.loading = true;

    const request = await pipe(
      composeAuth(this.token),
      TE.fromEither,
      TE.chain(formRequest(form, rectangle))
    )();

    pipe(
      request,
      E.fold(
        (e: NetworkError) => this.handleSearchError(e),
        (data: SearchSession) => this.processSearchRequest(data)
      )
    );
  }

  private async linkRequest(link: Link) {
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
        (data: SearchSession) => this.processSearchRequest(data)
      )
    );
  }

  private clearFilters() {
    pipe(
      this.clearFiltersLink,
      O.map((filterLink) => {
        this.filtersCleared.emit();
        this.linkRequest(filterLink);
      })
    );
  }

  private clearSearchArea() {
    this.isSearchAreaChanged = false;
    this.resetSearchArea.emit();

    const data = {
      left: 0.0,
      top: 0.0,
      width: 1.0,
      height: 1.0,
    };

    this.rectangleFormRequest(this.rectangleSearchForm, data);
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
            loading={this.loading}
            onCropAreaChanged={({ detail }: CustomEvent<Rectangle>) =>
              (this.cropArea = detail)
            }
          />
        </div>
        {this.rectangleSearchForm && this.isSearchAreaChanged ? (
          <div class="cropper-controls" part="controls">
            <button part="button" onClick={() => this.clearSearchArea()}>
              Reset search area
            </button>
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
      </Host>
    );
  }
}
