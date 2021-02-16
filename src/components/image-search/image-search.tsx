import { Component, Host, h, Prop, Listen, State } from "@stencil/core";
import { startSearchSession } from "../../searchSession/searchSession";
import { existAndNotEmpty } from "../../utils/collections/collectionsUtils";
import { createBearerHeaders } from "../../utils/token/tokenUtils";
import { NetworkError, networkErrorFrom } from "../../network/request";
import { SearchSessionResponce } from "../../searchSession/searchSession";
import { Recommendation } from "../../recommendation/recommendation";
import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";

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

@Component({
  tag: "image-search",
  styleUrl: "image-search.css",
  shadow: true,
})
export class ImageSearch {
  /** Mediaopt customer token */
  @Prop() token: string;

  @State() loading: boolean = false;
  @State() products: Recommendation[] = [];

  private slider: HTMLVprSliderElement;

  @Listen("imageSelected")
  async handleImageSelect({ detail }: CustomEvent<File>) {
    this.loading = true;

    const makeRequest = pipe(
      composeData(this.token, detail),
      TE.fromEither,
      TE.map(startSearchSession),
      TE.flatten
    );

    const data = await makeRequest();

    pipe(
      data,
      E.fold(
        (e: NetworkError) => this.handleSearchError(e),
        (data: SearchSessionResponce) => this.handleSearchSuccess(data)
      )
    );
  }

  private handleSearchError(_error: NetworkError) {
    this.loading = false;
  }

  private async handleSearchSuccess(data: SearchSessionResponce) {
    this.loading = false;
    await this.slider.loadProducts(data.vps.value);
  }

  render() {
    return (
      <Host>
        <image-selector />
        <image-view />
        {this.loading ? (
          <div class="loader">
            <slot name="loader">Loading...</slot>
          </div>
        ) : null}
        <vpr-slider
          mode="auto"
          imageWidth={100}
          imageRatio={1}
          part="grid"
          ref={(el) => (this.slider = el)}
        ></vpr-slider>
      </Host>
    );
  }
}
