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
  searchSessionClient,
  SearchSession,
  DetectedObject,
} from "../../searchSession/searchSession";
import { Recommendation } from "../../recommendation/recommendation";
import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";
import * as T from "fp-ts/Task";
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
    this.loading = true;

    pipe(
      this.linkRequest(detail),
      (request: TE.TaskEither<NetworkError, SearchSession>) =>
        this.processSearchRequest(request)
    );
  }

  @Listen("imageResized")
  async handleImageResize({ detail }: CustomEvent<File>) {
    this.loading = true;
    this.imageSelected = true;

    await pipe(
      composeData(this.token, detail),
      TE.fromEither,
      TE.chain(searchSessionClient),
      TE.fold(
        (e: NetworkError) => T.of(this.handleSearchRequestError(e)),
        (data: SearchSession) => async () => {
          this.handleSearchRequestSuccess(data);
          this.processObjectDetection(data);
        }
      )
    )();
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
    this.loading = true;

    const error: NetworkError = {
      errorType: "NetworkError",
      body: "Can not get a link rectangular search",
    };

    pipe(
      getLink(detail, "rectangle"),
      TE.fromOption(() => error),
      TE.chain((link) => this.linkRequest(link)),
      (request: TE.TaskEither<NetworkError, SearchSession>) =>
        this.processSearchRequest(request)
    );
  }

  componentWillLoad() {
    state.currencySign = this.currencySign;
  }

  private async processObjectDetection(data: SearchSession) {
    const error: NetworkError = {
      errorType: "NetworkError",
      body: "Can not get a link for objects detection",
    };

    await pipe(
      getLink(data, "detectedObjects"),
      TE.fromOption(() => error),
      TE.chain((link) => this.linkRequest(link)),
      TE.fold(
        (error: NetworkError) => T.of(this.handleSearchRequestError(error)),
        (objects: ValueObject<ValueObject<DetectedObject>[]>) =>
          T.of(this.renderDetectedObjects(foldValueObject(objects)))
      )
    )();
  }

  private renderDetectedObjects(
    detectedObjects: ValueObject<DetectedObject>[]
  ) {
    this.objectsDetected.emit(detectedObjects);
  }

  private cropImage() {
    const data = {
      ...this.cropArea,
      left: this.cropArea.x,
      top: this.cropArea.y,
    };

    this.rectangleFormRequest(this.rectangleSearchForm, data);
  }

  private rectangleFormRequest(form: Form, rectangle: RectangleAlt) {
    this.loading = true;

    pipe(
      composeAuth(this.token),
      TE.fromEither,
      TE.chain(formRequest(form, rectangle)),
      (request: TE.TaskEither<NetworkError, SearchSession>) =>
        this.processSearchRequest(request)
    );
  }

  private linkRequest<T>(
    link: Link
  ): TE.TaskEither<NetworkError, ValueObject<T>> {
    return pipe(
      composeAuth(this.token),
      TE.fromEither,
      TE.chain(linkRequest<T>(link))
    );
  }

  private clearFilters() {
    this.loading = true;

    const error: NetworkError = {
      errorType: "NetworkError",
      body: "Can not get a link for clearing filters",
    };

    pipe(
      this.clearFiltersLink,
      TE.fromOption(() => error),
      TE.chain((filterLink) => {
        this.filtersCleared.emit();
        return this.linkRequest(filterLink);
      }),
      (request: TE.TaskEither<NetworkError, SearchSession>) =>
        this.processSearchRequest(request)
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

  private async processSearchRequest(
    request: TE.TaskEither<NetworkError, SearchSession>
  ) {
    await pipe(
      request,
      TE.fold(
        (e: NetworkError) => T.of(this.handleSearchRequestError(e)),
        (data: SearchSession) => T.of(this.handleSearchRequestSuccess(data))
      )
    )();
  }

  private handleSearchRequestSuccess(data: SearchSession) {
    this.loading = false;

    this.slider.resetSliderPosition();
    this.slider.loadProducts(data.value);
    this.filters = readFilters(foldValueObject(data.filters));
    this.rectangleSearchForm = data.searchArea;
    this.clearFiltersLink = getLink(data, "clearFilters");

    pipe(
      O.fromNullable(data.detectedObjects),
      O.map((objects) => this.renderDetectedObjects(objects))
    );
  }

  private handleSearchRequestError(_error: NetworkError) {
    this.loading = false;
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
