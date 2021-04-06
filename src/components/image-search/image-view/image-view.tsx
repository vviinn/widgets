import { Component, Host, h, Listen, Prop, State } from "@stencil/core";
import { fromFile } from "../../../Image/fromFile";
import { Rectangle } from "../../../geometry/Rectangle";
import { DetectedObject } from "../../../searchSession/searchSession";

@Component({
  tag: "image-view",
  styleUrl: "image-view.css",
  shadow: true,
})
export class ImageView {
  private imageContainer: HTMLImageElement | undefined;
  private image: HTMLImageElement | undefined;

  @Prop() hidden: boolean = false;

  @State() objectsView: Map<DetectedObject, Rectangle> = new Map();

  @Listen("imageSelected", { target: "document" })
  async handleImageSelect({ detail }: CustomEvent<File>) {
    this.image = await fromFile(detail);
    this.imageContainer.src = this.image.src;
  }

  @Listen("objectsDetected", { target: "document" })
  async handleObjectsDetected({ detail }: CustomEvent<DetectedObject[]>) {
    this.objectsView = new Map();

    for (const o of detail) {
      const rect: Rectangle = {
        position: {
          x: this.image.width * o.rectangle.left,
          y: this.image.height * o.rectangle.top,
        },
        width: this.image.width * o.rectangle.width,
        height: this.image.height * o.rectangle.height,
      };

      this.objectsView.set(o, rect);
    }
  }

  render() {
    return (
      <Host class={{ hidden: this.hidden }}>
        {[...this.objectsView.entries()].map(([object, rect]) => (
          <div class="detected-object">
            <selection-box selection={rect} />
            <span
              class="detected-object-name"
              style={{
                transform: `translate(${rect.position.x}px, ${rect.position.y}px)`,
              }}
            >
              {object.class} {object.score}%
            </span>
          </div>
        ))}

        <img ref={(el) => (this.imageContainer = el)} />
      </Host>
    );
  }
}
