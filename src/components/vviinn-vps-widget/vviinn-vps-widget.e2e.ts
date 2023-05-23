import { newE2EPage } from "@stencil/core/testing";

describe("example", () => {
  it("should render a foo-component", async () => {
    const page = await newE2EPage();
    await page.setContent(`<vviinn-vps-widget active="true"
token="eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOjgzLCJqdGkiOiI3ZTg2Y2I1YS00ZTFjLTRhYjctYjU2My1lN2FjMTYzZTYyZDIiLCJzY29wZXMiOlsidnByIiwidnBzIiwidnBjIl19.SbaQnBkvoXer3GPCWUthFQStFKLHZNMBfj4Qu44WHM8nzaIt48I74yVy4gVbX29vtd6jIkDPdakqEXRXmAxOCtv7_nsd4iBs1yMegfOWW5g8f10PKfZqmWJcfhwKIEElnUMFmP6rXpogntZ7iFfeTBbiRNzQPhkaa7jUjgQkCC4"></vviinn-vps-widget>`);

    const widget = await page.find("vviinn-vps-widget");
    await page.waitForChanges();
    const spy = await widget.spyOnEvent("viinnProductView");

    await page.waitForChanges();

    const exampleImage = await page.find("vviinn-vps-widget >>> vviinn-slide");

    await page.waitForChanges();

    console.log(exampleImage.nodeName);

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
