import { newE2EPage } from "@stencil/core/testing";
import { STORYBOOK_TOKEN } from "../../storybook";

describe("example", () => {
  it("should render a foo-component", async () => {
    const page = await newE2EPage();
    await page.setContent(`<vviinn-vps-widget active="true"
token=${STORYBOOK_TOKEN}></vviinn-vps-widget>`);

    const widget = await page.find("vviinn-vps-widget");
    await page.waitForChanges();
    const spy = await widget.spyOnEvent("viinnProductView");

    await page.waitForChanges();

    const exampleImage = await page.find("vviinn-vps-widget >>> vviinn-slide");

    await page.waitForChanges();

    exampleImage.classList.add("ololo");

    await page.waitForChanges();
    await exampleImage.click();
    await page.waitForChanges();

    //await page.debugger();
    await page.waitForChanges();
    await new Promise((res) => {
      setTimeout(() => res(undefined), 1400);
    });

    expect(spy).toHaveReceivedEvent();
    expect(widget).toHaveClass("hydrated");
  });
});
