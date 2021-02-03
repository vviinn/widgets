import { newSpecPage } from "@stencil/core/testing";
import { ImageSelector } from "../image-selector";

describe("image-selector", () => {
  it("renders", async () => {
    const page = await newSpecPage({
      components: [ImageSelector],
      html: `<image-selector></image-selector>`,
    });
    expect(page.root).toEqualHtml(`
<image-selector>
    <mock:shadow-root>
        <input accept="image/png, image/jpeg, image/webp" type="file" />
    </mock:shadow-root>
</image-selector>
`);
  });
});
