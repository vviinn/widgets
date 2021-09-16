import { Component, Host, h, Prop, Event, EventEmitter } from "@stencil/core";
import { pipe } from "fp-ts/lib/function";
import { toFile } from "../../../Image/toFile";
import { imageSearchState, uploadFile } from "../../../store/imageSearch.store";
import * as TE from "fp-ts/lib/TaskEither";
import { some } from "fp-ts/lib/Option";

@Component({
  tag: "vviinn-example-image",
  styleUrl: "vviinn-example-image.css",
  shadow: true,
})
export class VviinnExampleImage {
  @Prop() src: string = "";
  @Prop() width: number = 0;
  @Prop() height: number = 0;

  @Event() exampleImageSelected: EventEmitter<void>;
  @Event() exampleImageError: EventEmitter<void>;

  private async selectImage(event: UIEvent) {
    const image = event.target as HTMLImageElement;
    const file = await toFile(this.src);

    await pipe(
      uploadFile(file),
      TE.map(() => {
        imageSearchState.image = some(image);
        imageSearchState.imageUrl = some(this.src);
        this.exampleImageSelected.emit();
      }),
      TE.mapLeft(() => {
        this.exampleImageError.emit();
      })
    )();
  }

  render() {
    return (
      <Host>
        <img
          onClick={(ev) => this.selectImage(ev)}
          src={this.src}
          width={this.width}
          height={this.height}
        />
      </Host>
    );
  }
}
