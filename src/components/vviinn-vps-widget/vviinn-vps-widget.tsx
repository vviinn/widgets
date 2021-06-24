import { Component, Host, h, State, Prop } from "@stencil/core";
import state from "../../store/store";
import { imageSearchState } from "../../store/imageSearch.store";

@Component({
  tag: "vviinn-vps-widget",
  styleUrl: "vviinn-vps-widget.css",
  shadow: true,
})
export class VviinnVpsWidget {
  @Prop() token: string =
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOjUxLCJqdGkiOiI1MThlOWNkNC1hYzlmLTRiMDMtOTEzNS03ZDRmNTgyZjRjOWUiLCJzY29wZXMiOlsidnByIiwidnBzIiwidnBjIl19.kTNkhH90cpYUPVYvd7OAJJQ2WbUxAIY_MMJcLD1MxQxFiLx_0m3KkjTUk4ZyZIjPqd3jJj-NQglvlkV-RQA7fKk4oY3y7GxiLVKPaieEYi1ltxUChRNH-ggzgPQdxozRQh9TsIov-KJfLC9AUXUQBkbTBZF9FP4lOAAtNmDZ38Q";
  @State() slidePosition: number = 0;

  connectedCallback() {
    state.apiPath = "https://stage.mediaopt.tools";
    imageSearchState.token = this.token;
  }

  private handleImageSelection() {
    this.slidePosition = 1;
  }

  render() {
    return (
      <Host>
        <vviinn-overlayed-modal class={{ "first-screen": this.slidePosition === 0 }} active={true} onSecondaryActionClicked={() => this.slidePosition = 0}>
          <vviinn-slider showBullets={false} position={this.slidePosition}>
            <vviinn-slide class="start-page">
              <div class="start-page_block">
                <vviinn-teaser />
                <image-selector
                  onImageSelected={() => this.handleImageSelection()}
                >
                  <span slot="upload-button-text" class="upload-button-content">
                    <svg
                      width="29"
                      height="28"
                      viewBox="0 0 29 28"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M10.2713 3.88964C10.4336 3.64621 10.7068 3.5 10.9994 3.5H17.9994C18.2919 3.5 18.5651 3.64621 18.7274 3.88964L20.2176 6.125H23.25C23.9462 6.125 24.6139 6.40156 25.1062 6.89385C25.5984 7.38613 25.875 8.05381 25.875 8.75V21C25.875 21.6962 25.5984 22.3639 25.1062 22.8562C24.6139 23.3484 23.9462 23.625 23.25 23.625H5.75C5.05381 23.625 4.38613 23.3484 3.89384 22.8562C3.40156 22.3639 3.125 21.6962 3.125 21V8.75C3.125 8.05381 3.40156 7.38613 3.89384 6.89385C4.38613 6.40156 5.05381 6.125 5.75 6.125H8.78107L10.2713 3.88964ZM11.4676 5.25L9.9774 7.48536C9.81512 7.72879 9.54192 7.875 9.24936 7.875H5.75C5.51794 7.875 5.29538 7.96719 5.13128 8.13128C4.96719 8.29538 4.875 8.51794 4.875 8.75V21C4.875 21.2321 4.96719 21.4546 5.13128 21.6187C5.29538 21.7828 5.51794 21.875 5.75 21.875H23.25C23.4821 21.875 23.7046 21.7828 23.8687 21.6187C24.0328 21.4546 24.125 21.2321 24.125 21V8.75C24.125 8.51794 24.0328 8.29538 23.8687 8.13128C23.7046 7.96719 23.4821 7.875 23.25 7.875H19.7494C19.4568 7.875 19.1836 7.72879 19.0213 7.48536L17.5311 5.25H11.4676Z"
                        fill="white"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M14.5 11.375C12.8086 11.375 11.4375 12.7461 11.4375 14.4375C11.4375 16.1289 12.8086 17.5 14.5 17.5C16.1914 17.5 17.5625 16.1289 17.5625 14.4375C17.5625 12.7461 16.1914 11.375 14.5 11.375ZM9.6875 14.4375C9.6875 11.7796 11.8421 9.625 14.5 9.625C17.1579 9.625 19.3125 11.7796 19.3125 14.4375C19.3125 17.0954 17.1579 19.25 14.5 19.25C11.8421 19.25 9.6875 17.0954 9.6875 14.4375Z"
                        fill="white"
                      />
                    </svg>
                    <span>Take or upload a photo</span>
                  </span>
                </image-selector>
                <vviinn-privacy-badge />
              </div>
              <div class="start-page_block">
                <vviinn-onboarding />
              </div>
            </vviinn-slide>
            <vviinn-slide class="results-page">
              <div class="image-wrapper">
                <vviinn-image-view />
                <div class="filters-wrapper">
                  <div class="filters">
                    {imageSearchState.filters.map((filter) => <search-filters filter={filter} />)}
                  </div>
                </div>
              </div>
              <div class="products-wrapper">
                <div class="products">
                  {imageSearchState.results.map((p) => (
                    <vpr-result item={p} imageWidth={176} />
                  ))}
                </div>
              </div>
            </vviinn-slide>
          </vviinn-slider>
        </vviinn-overlayed-modal>
      </Host>
    );
  }
}
