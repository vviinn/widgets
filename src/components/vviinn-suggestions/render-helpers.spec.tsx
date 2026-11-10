// marked ships ESM only, which Jest can't parse; Stencil's transformer doesn't hoist jest.mock,
// so it has to precede the import. The text in these tests has no Markdown to render.
jest.mock("marked", () => ({
  marked: { parseInline: (text: string) => text },
}));

import { h } from "@stencil/core";
import { newSpecPage } from "@stencil/core/testing";
import type { ContextAnnotation } from "../../interfaces";
import { renderAnnotatedContent } from "./render-helpers";

const annotationWithDeeplink = (deeplink: string) =>
  ({
    locator: { start: 4, length: 5 },
    data: { items: [{ deeplink }] },
  }) as unknown as ContextAnnotation;

const render = (deeplink: string) =>
  newSpecPage({
    components: [],
    template: () => (
      <ul>
        {renderAnnotatedContent(
          "See Boots now",
          [annotationWithDeeplink(deeplink)],
          jest.fn(),
          new Set(),
          "s",
        )}
      </ul>
    ),
  });

it("links an annotation with a web deeplink", async () => {
  const page = await render("https://shop.com/boots");
  const link = page.body.querySelector("a.suggestion-link");

  expect(link.getAttribute("href")).toBe("https://shop.com/boots");
  expect(link.textContent).toBe("Boots");
});

it("renders an annotation with a script deeplink as plain text", async () => {
  const page = await render("javascript:alert(1)");
  const item = page.body.querySelector("li");

  expect(item.querySelector("a, button")).toBeNull();
  expect(item.textContent).toContain("Boots");
});
