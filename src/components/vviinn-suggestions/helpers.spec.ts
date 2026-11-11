// Stencil's mock DOM can't run DOMPurify, so the sanitizer tests get one bound to jsdom.
// Stencil's transformer doesn't hoist jest.mock, so it has to precede the import.
jest.mock("dompurify", () => {
  const { JSDOM } = jest.requireActual("jsdom");
  const createDOMPurify = jest.requireActual("dompurify");
  return { __esModule: true, default: createDOMPurify(new JSDOM("").window) };
});

import DOMPurify from "dompurify";
import { RequestDynamicFilterItem } from "../../campaign/VPRCampaignService";
import { extractActiveFilterValues, sanitizeSuggestionHtml } from "./helpers";

it("keys categorical request values as column:value", () => {
  const filters = [
    { column: "brand", values: ["Vito", "JOOP"] },
  ] as unknown as RequestDynamicFilterItem[];

  const keys = extractActiveFilterValues(filters);

  expect(keys.has("brand:Vito")).toBe(true);
  expect(keys.has("brand:JOOP")).toBe(true);
});

it("keys interval request values as column:start-end (not [object Object])", () => {
  const filters = [
    { column: "price", values: [{ start: 100, end: 200 }] },
  ] as unknown as RequestDynamicFilterItem[];

  const keys = extractActiveFilterValues(filters);

  expect(keys.has("price:100-200")).toBe(true);
  expect(keys.has("price:[object Object]")).toBe(false);
});

describe("sanitizeSuggestionHtml", () => {
  it("keeps what marked renders", () => {
    const html =
      '<h2>Tip</h2><ol start="2"><li><strong>b</strong> <em>i</em> <del>d</del> <code>c</code> <a href="https://shop.com" title="t">shop</a></li></ol>';

    expect(sanitizeSuggestionHtml(html)).toBe(html);
  });

  it.each([
    ["a script", "<script>alert(1)</script>ok"],
    ["a handler", '<a href="https://shop.com" onclick="alert(1)">ok</a>'],
    ["a dialog", "<dialog open>ok</dialog>"],
    ["an image", '<img src="https://evil.com/x.png" width="2000">ok'],
    ["an SVG", '<svg width="4000"><rect width="4000"/></svg>ok'],
    ["a form", '<form action="https://evil.com"><input name="p"></form>ok'],
    [
      "a style",
      '<style>*{display:none}</style><b style="position:fixed">ok</b>',
    ],
    ["a class", '<span class="suggestion-link">ok</span>'],
    ["an aria attribute", '<p aria-hidden="true">ok</p>'],
    ["a data attribute", '<p data-track="x">ok</p>'],
  ])("drops %s", (_, html) => {
    const result = sanitizeSuggestionHtml(html);

    expect(result).not.toMatch(
      /<(script|dialog|img|svg|form|input|style)|on\w+=|style=|class=|aria-|data-/,
    );
    expect(result).toContain("ok");
  });

  it("keeps the text of a link with a script scheme, not its href", () => {
    expect(
      sanitizeSuggestionHtml('<a href="javascript:alert(1)">win</a>'),
    ).toBe("<a>win</a>");
  });

  it("escapes the whole text when DOMPurify can't run", () => {
    DOMPurify.isSupported = false;
    try {
      expect(sanitizeSuggestionHtml('<img src=x onerror="alert(1)">')).toBe(
        "&#60;img src=x onerror=&#34;alert(1)&#34;&#62;",
      );
    } finally {
      DOMPurify.isSupported = true;
    }
  });
});
