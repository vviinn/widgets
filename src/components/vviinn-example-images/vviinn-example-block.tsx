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

  componentWillLoad() {
    slotChangeListener(this, this.el);
  }

  render() {
    return (
      <Host>
        <slot name="vviinn-example-image">
          <vviinn-example-image
            src="https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fdesignbump.com%2Fwp-content%2Fuploads%2F2015%2F08%2FLiving-Room-Furniture.jpg&f=1&nofb=1&ipt=cd1aa91486be296714331de6746acb3169edf13a69040cbaaac30ed958569419&ipo=images"
            is-clickable="false"
          />
        </slot>

        <button class="onboarding-button">
          <RoundCameraIcon />
        </button>
      </Host>
    );
  }
}
