import { Component, Host, h, State, Prop, Element } from "@stencil/core";
import state from "../../store/store";
import { imageSearchState } from "../../store/imageSearch.store";
import * as O from "fp-ts/lib/Option";

@Component({
  tag: "vviinn-vps-widget",
  styleUrl: "vviinn-vps-widget.css",
  shadow: true,
})
export class VviinnVpsWidget {
  @Element() el: HTMLElement;

  @Prop() token: string =
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOjUxLCJqdGkiOiI1MThlOWNkNC1hYzlmLTRiMDMtOTEzNS03ZDRmNTgyZjRjOWUiLCJzY29wZXMiOlsidnByIiwidnBzIiwidnBjIl19.kTNkhH90cpYUPVYvd7OAJJQ2WbUxAIY_MMJcLD1MxQxFiLx_0m3KkjTUk4ZyZIjPqd3jJj-NQglvlkV-RQA7fKk4oY3y7GxiLVKPaieEYi1ltxUChRNH-ggzgPQdxozRQh9TsIov-KJfLC9AUXUQBkbTBZF9FP4lOAAtNmDZ38Q";
  @State() slidePosition: number = 0;
  @State() width: number = 0;

  private body: HTMLVviinnSliderElement;

  connectedCallback() {
    state.apiPath = "https://stage.mediaopt.tools";
    state.currencySign = "€";
    imageSearchState.token = this.token;
  }

  componentDidLoad() {
    const observer = new ResizeObserver((sizes: ResizeObserverEntry[]) => {
      if (sizes.length === 0) return;
      const entry = sizes[0];
      this.width = entry.contentRect.width;
    });

    observer.observe(this.body);
  }

  private handleImageSelection() {
    this.slidePosition = 1;
    const root = this.el.shadowRoot.querySelector("vviinn-overlayed-modal");
    const overlay = root.shadowRoot.querySelector("vviinn-overlay");
    const modal = overlay.querySelector("vviinn-modal");
    const modalBody = modal.shadowRoot.querySelector(".body");
    modalBody.scrollTop = 0;
  }

  private resetState() {
    this.slidePosition = 0;
    imageSearchState.image = O.none;
    imageSearchState.imageUrl = O.none;
    imageSearchState.imageBounds = O.none;
    imageSearchState.searchArea = O.none;
    imageSearchState.results = [];
    imageSearchState.filters = [];
    imageSearchState.activeIonLink = undefined;
    imageSearchState.rectangleSearchForm = undefined;
  }

  render() {
    return (
      <Host>
        <vviinn-overlayed-modal
          class={{ "first-screen": this.slidePosition === 0 }}
          active={true}
          onSecondaryActionClicked={() => this.resetState()}
        >
          <vviinn-slider
            showBullets={false}
            position={this.slidePosition}
            ref={(el) => (this.body = el)}
          >
            <vviinn-slide class="start-page">
              <div class="start-page_block">
                <vviinn-teaser />
                <vviinn-image-selector
                  onImageSelected={() => this.handleImageSelection()}
                >
                  <span slot="upload-button-text" class="upload-button-content">
                    <svg xmlns="http://www.w3.org/2000/svg" width="29" height="28" fill="none">
                      <defs />
                      <path fill="#fff" fill-rule="evenodd" d="M10.271 3.89A.875.875 0 0111 3.5h7c.293 0 .566.146.728.39l1.49 2.235h3.033a2.625 2.625 0 012.625 2.625V21a2.625 2.625 0 01-2.625 2.625H5.75A2.625 2.625 0 013.125 21V8.75A2.625 2.625 0 015.75 6.125h3.031l1.49-2.235zm1.197 1.36l-1.49 2.235a.875.875 0 01-.729.39H5.75a.875.875 0 00-.875.875V21a.875.875 0 00.875.875h17.5a.875.875 0 00.875-.875V8.75a.875.875 0 00-.875-.875h-3.5a.875.875 0 01-.729-.39l-1.49-2.235h-6.063z" clip-rule="evenodd" />
                      <path fill="#fff" fill-rule="evenodd" d="M14.5 11.375a3.062 3.062 0 100 6.125 3.062 3.062 0 000-6.125zm-4.813 3.063a4.812 4.812 0 119.625 0 4.812 4.812 0 01-9.625 0z" clip-rule="evenodd" />
                    </svg>
                    <span>Kamera oder Bild auswählen</span>
                  </span>
                </vviinn-image-selector>
                <vviinn-privacy-badge />
              </div>
              <div class="start-page_block">
                <div class="onboarding-wrapper">
                  <vviinn-onboarding />
                  <vviinn-example-images
                    onImageSelected={() => this.handleImageSelection()}
                  />
                </div>
              </div>
            </vviinn-slide>
            <vviinn-slide class="results-page">
              <div class="image-wrapper">
                <vviinn-image-view />
                <div class="filters-wrapper">
                  <div class="filters">
                    {imageSearchState.filters.map((filter) => (
                      <search-filters filter={filter} />
                    ))}
                  </div>
                </div>
              </div>
              <div class="products-wrapper">
                <div class="products">
                  {imageSearchState.results.map((p) => (
                    <vpr-result
                      item={p}
                      imageWidth={this.width <= 320 ? 300 : 168}
                      imageSizes={{
                        "320w": 300,
                        "321w": 168,
                      }}
                    />
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
