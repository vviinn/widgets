import { newE2EPage } from "@stencil/core/testing";

describe("image-selector", () => {
  it("renders", async () => {
    const page = await newE2EPage();
    await page.setContent("<image-selector></image-selector>");

    const element = await page.find("image-selector");
    expect(element).toHaveClass("hydrated");
  });

  it("have image input", async () => {
    const page = await newE2EPage();
    await page.setContent("<image-selector></image-selector>");

    const input = await page.find("image-selector >>> input");

    expect(input).toHaveAttribute("type");
    expect(input).toHaveAttribute("accept");
    expect(input).toHaveAttribute("capture");
  });

  it("have drag'n'drop zone", async () => {
    const page = await newE2EPage();
    await page.setContent("<image-selector></image-selector>");

    const dropZone = await page.find("image-selector >>> #drop-zone");

    expect(dropZone).toHaveAttribute("ondrop");
    expect(dropZone).toHaveAttribute("ondragover");
  });
});
