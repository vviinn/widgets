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

    //const element = await page.find("image-selector");
    const input = await page.find("image-selector >>> input");

    expect(input).toHaveAttribute("type", "file");
    //expect(input).toHaveProperty("accept", "image/png, image/jpeg, image/webp");
  });
});
