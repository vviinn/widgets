import {
  Component,
  Host,
  h,
  Prop,
  Listen,
  State,
  Element,
} from "@stencil/core";
import { existAndNotEmpty } from "../../utils/collections/collectionsUtils";
import { createBearerHeaders } from "../../utils/token/tokenUtils";
import { NetworkError, networkErrorFrom } from "../../network/request";
import {
  readFilters,
  SearchSessionFilter,
  SearchSessionFilters,
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
  searchSessionClient,
} from "../../network/ionClient";
import {
  fromImage,
  fromNaturalImage,
  Rectangle,
  scaleSelection,
} from "../../geometry/Rectangle";

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
        left: rectangle.position.x,
        top: rectangle.position.y,
        width: rectangle.width,
        height: rectangle.height,
      };
      const body = JSON.stringify(data);
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

  @State() loading: boolean = false;
  @State() imageSelected: boolean = false;
  @State() showCropper: boolean = false;
  @State() products: Recommendation[] = [];
  @State() filters: SearchSessionFilter[] = [];
  @State() rectangleSearchLink: O.Option<IonLink> = O.none;
  @State() clearFiltersLink: O.Option<IonLink> = O.none;

  slider: HTMLVprSliderElement;
  private cropper: HTMLImageCropperElement | undefined;

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
        (data) => this.processSearchRequest(data)
      )
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
        (data: IonItem<null>) => this.processSearchRequest(data)
      )
    );
  }

  private processSearchRequest(data: IonItem<null>) {
    this.loading = false;
    this.handleSearchSuccess(data.value);
    this.showFilters(data.filters as IonItem<SearchSessionFilters>);
    this.rectangleSearchLink = getLink(data, "withRectangle");
    this.clearFiltersLink = getLink(data, "clearFilters");
  }

  private showFilters(filters: IonItem<SearchSessionFilters>) {
    this.filters = readFilters(foldIonItem(filters));
  }

  private handleSearchError(_error: NetworkError) {
    this.loading = false;
  }

  async handleSearchSuccess(data: Recommendation[]) {
    await this.slider.loadProducts(data);
  }

  private async toggleCropper() {
    if (this.showCropper && this.cropper) {
      const selection: Rectangle = await this.cropper.getSelection();
      const image: HTMLImageElement = this.el.shadowRoot
        .querySelector("image-view")
        .shadowRoot.querySelector("img");

      const imageRect = fromImage(image);
      const originImageRect = fromNaturalImage(image);
      const scaledSelection = scaleSelection(
        imageRect,
        selection,
        originImageRect
      );

      pipe(
        this.rectangleSearchLink,
        O.map((link) => this.createRectangleRequest(link, scaledSelection))
      );

      //const rectangleSearchRequest = linkRequest()
    }
    this.showCropper = !this.showCropper;
  }

  private async createRectangleRequest(link: IonLink, selection: Rectangle) {
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
        (data: IonItem<null>) => this.processSearchRequest(data)
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
        <image-selector />
        <div class="image-view">
          <image-view hidden={!this.imageSelected} />
          {this.showCropper ? (
            <image-cropper ref={(el) => (this.cropper = el)} />
          ) : null}
        </div>
        {this.loading ? (
          <div class="loader">
            <slot name="loader">Loading...</slot>
          </div>
        ) : null}
        {O.isSome(this.rectangleSearchLink) ? (
          <button onClick={() => this.toggleCropper()}>
            {this.showCropper ? "select region" : "show cropper"}
          </button>
        ) : null}
        {this.filters.map((f) => (
          <search-filters filter={f} />
        ))}
        {O.isSome(this.clearFiltersLink) ? (
          <button onClick={() => this.clearFilters()}>Clear filters</button>
        ) : null}
        <vpr-slider
          mode="grid"
          imageWidth={100}
          imageRatio={1}
          part="grid"
          ref={(el) => (this.slider = el)}
        ></vpr-slider>
      </Host>
    );
  }
}
