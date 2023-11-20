import {
  Component,
  Host,
  h,
  Prop,
  Event,
  EventEmitter,
  State,
  Watch,
  Element,
} from "@stencil/core";
import { pipe } from "fp-ts/lib/function";
import { toFile } from "../../Image/toFile";
import { processSelectedFile } from "../../store/imageSearch.store";
import * as E from "fp-ts/lib/Either";
import { BasicEventData } from "../../recommendation/events";
import { RoundCameraIcon } from "../vviinn-icons";

@Component({
  tag: "vviinn-example-image",
  styleUrl: "vviinn-example-image.css",
  shadow: true,
})
export class VviinnExampleImage {
  @Element() el: HTMLElement;
  @Prop() src: string =
    "https://cdn.stage.vviinn.com/image/0/fit/1200/0/ce/0/Z3M6Ly92dmlpbm4tY2F0YWxvZy1pbWFnZXMtc3RhZ2Uvc3RvcmFnZS5nb29nbGVhcGlzLmNvbS9FTWE1UWhvVWNlQS1MM1oyYVdsdWJpMXlaV1psY21WdVkyVXRZMkYwWVd4dlp5OXBiV0ZuWlY5aGRIUnlhV0oxZEdWZlkyRjBZV3h2Wnk5cGJXRm5aWE12VWtNeE15OVNRekV6WDJsdFlXZGxYekF3TG1wd1p3LmpwZw==";
  @Prop() width: number = 0;
  @Prop() height: number = 0;
  @Prop() basicEventData: BasicEventData;
  @Prop() isClickable: boolean = true;
  @Prop() srcObject: MediaStream;

  @State() selected: boolean = false;

  @Event() vviinnImageUpload: EventEmitter<BasicEventData>;
  @Event() vviinnNoResult: EventEmitter<BasicEventData>;

  /** @internal */
  @Event() vviinnImageUploadFinished: EventEmitter;

  private async selectImage() {
    this.selected = true;
    this.vviinnImageUpload.emit(this.basicEventData);
    const file = await toFile(this.src);
    const processResult = await processSelectedFile(file);

    pipe(
      processResult,
      E.match(
        () => this.vviinnNoResult.emit(this.basicEventData),
        () => this.vviinnImageUploadFinished.emit()
      )
    );

    this.selected = false;
  }

  private handleKeyPress({ key }: KeyboardEvent) {
    if (key !== "Enter" && key !== " ") return;
    this.selectImage();
  }

  @Watch("srcObject")
  handleSrcObjectChange() {
    if (!this.srcObject) return;
    const video = this.el.shadowRoot.getElementById(
      "camera-preview"
    ) as HTMLVideoElement;
    video.srcObject = this.srcObject;
  }

  render() {
    return (
      <Host
        onKeyUp={
          this.isClickable
            ? (ev: KeyboardEvent) => this.handleKeyPress(ev)
            : undefined
        }
      >
        <video
          id="camera-preview"
          class={{ hidden: !this.srcObject }}
          autoplay
          playsinline
          muted
        ></video>
        <img
          src={this.src}
          width={this.width}
          height={this.height}
          tabindex={1}
          class={{ hidden: !!this.srcObject }}
        />
        <button
          class="example-button"
          onClick={this.isClickable ? () => this.selectImage() : undefined}
        >
          <RoundCameraIcon />
        </button>
      </Host>
    );
  }
}
