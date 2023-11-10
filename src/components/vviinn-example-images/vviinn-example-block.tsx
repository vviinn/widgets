import {
  Component,
  Host,
  h,
  Event,
  EventEmitter,
  Element,
  Prop,
} from "@stencil/core";

import { slotChangeListener } from "../customized-slots";
import { BasicEventData } from "../../recommendation/events";
import { RoundCameraIcon } from "../vviinn-icons";

@Component({
  tag: "vviinn-example-block",
  styleUrl: "vviinn-example-block.css",
  shadow: true,
})
export class VviinnExampleBlock {
  @Element() el: HTMLElement;

  @Event() vviinnImageUpload: EventEmitter<BasicEventData>;
  @Event() vviinnNoResult: EventEmitter<BasicEventData>;

  /** @internal */
  @Event() vviinnImageUploadFinished: EventEmitter;

  @Prop() basicEventData: BasicEventData;
  @Prop() exampleImagesTitle: string;

  private imagesBlock!: HTMLDivElement;

  componentWillLoad() {
    slotChangeListener(this, this.el);
  }

  private delegateFocus() {
    const firstSlot = this.imagesBlock.childNodes[0];
    const firstExampleImage = firstSlot.childNodes[0];

    (firstExampleImage as HTMLElement).focus();
  }

  render() {
    return (
      <Host onFocus={() => this.delegateFocus()}>
        <slot name="vviinn-example-images-1">
          <vviinn-example-image
            src="https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fdesignbump.com%2Fwp-content%2Fuploads%2F2015%2F08%2FLiving-Room-Furniture.jpg&f=1&nofb=1&ipt=cd1aa91486be296714331de6746acb3169edf13a69040cbaaac30ed958569419&ipo=images"
            is-clickable="false"
          />
        </slot>

        <button class="onboarding-button">
          <RoundCameraIcon />
        </button>
      </Host>
      // <Host onFocus={() => this.delegateFocus()}>
      //   <slot name="vviinn-example-images-title">
      //     <h3>{this.exampleImagesTitle}</h3>
      //   </slot>
      //   <div
      //     class="images"
      //     ref={(el) => (this.imagesBlock = el as HTMLDivElement)}
      //   >
      //     <slot name="vviinn-example-images-1">
      //       <vviinn-example-image
      //         width={480}
      //         height={640}
      //         src="https://cdn.vviinn.com/0/fit/480/0/ce/0/Z3M6Ly9haWFhcy1pbWdwcm94eS9leGFtcGxlcy9pbWctaW5zcGlyYXRpb24tMDEtTC5qcGc="
      //         basicEventData={this.basicEventData}
      //       />
      //     </slot>
      //     <slot name="vviinn-example-images-2">
      //       <vviinn-example-image
      //         width={280}
      //         height={480}
      //         src="https://cdn.vviinn.com/0/fit/480/0/ce/0/Z3M6Ly9haWFhcy1pbWdwcm94eS9leGFtcGxlcy9pbWctaW5zcGlyYXRpb24tMDItTS5qcGc="
      //         basicEventData={this.basicEventData}
      //       />
      //     </slot>
      //     <slot name="vviinn-example-images-3">
      //       <vviinn-example-image
      //         width={280}
      //         height={480}
      //         src="https://cdn.vviinn.com/0/fit/480/0/ce/0/Z3M6Ly9haWFhcy1pbWdwcm94eS9leGFtcGxlcy9pbWctaW5zcGlyYXRpb24tMDMtTS5qcGc="
      //         basicEventData={this.basicEventData}
      //       />
      //     </slot>
      //     <slot name="vviinn-example-images-4">
      //       <vviinn-example-image
      //         width={480}
      //         height={640}
      //         src="https://cdn.vviinn.com/0/fit/480/0/ce/0/Z3M6Ly9haWFhcy1pbWdwcm94eS9leGFtcGxlcy9pbWctaW5zcGlyYXRpb24tMDQtTC5qcGc="
      //         basicEventData={this.basicEventData}
      //       />
      //     </slot>
      //   </div>
      // </Host>
    );
  }
}
