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
          <vviinn-example-image src="https://cdn.stage.vviinn.com/image/0/fit/1200/0/ce/0/Z3M6Ly92dmlpbm4tY2F0YWxvZy1pbWFnZXMtc3RhZ2Uvc3RvcmFnZS5nb29nbGVhcGlzLmNvbS9FTWE1UWhvVWNlQS1MM1oyYVdsdWJpMXlaV1psY21WdVkyVXRZMkYwWVd4dlp5OXBiV0ZuWlY5aGRIUnlhV0oxZEdWZlkyRjBZV3h2Wnk5cGJXRm5aWE12VWtNeE15OVNRekV6WDJsdFlXZGxYekF3TG1wd1p3LmpwZw==" />
        </slot>
      </Host>
    );
  }
}
