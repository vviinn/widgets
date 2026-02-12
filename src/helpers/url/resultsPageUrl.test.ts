import {
  resolveResultsPageUrl,
  isOnResultsPage,
  buildTextSearchRedirectUrl,
  buildImageSearchRedirectUrl,
} from "./resultsPageUrl";

describe("resolveResultsPageUrl", () => {
  it("resolves a pathname to a full URL using current origin", () => {
    const url = resolveResultsPageUrl("/search");
    expect(url.pathname).toBe("/search");
    expect(url.origin).toBe(window.location.origin);
  });

  it("resolves a full URL keeping its own origin", () => {
    const url = resolveResultsPageUrl("https://shop.com/search");
    expect(url.pathname).toBe("/search");
    expect(url.origin).toBe("https://shop.com");
  });

  it("preserves existing query params in the URL", () => {
    const url = resolveResultsPageUrl("/search?lang=en");
    expect(url.pathname).toBe("/search");
    expect(url.searchParams.get("lang")).toBe("en");
  });
});

describe("isOnResultsPage", () => {
  const originalLocation = window.location;

  const setLocation = (url: string) => {
    Object.defineProperty(window, "location", {
      value: new URL(url),
      writable: true,
      configurable: true,
    });
  };

  afterEach(() => {
    Object.defineProperty(window, "location", {
      value: originalLocation,
      writable: true,
      configurable: true,
    });
  });

  it("returns true when current pathname matches the results page", () => {
    setLocation("https://example.com/search");
    expect(isOnResultsPage("/search")).toBe(true);
  });

  it("returns false when current pathname does not match", () => {
    setLocation("https://example.com/home");
    expect(isOnResultsPage("/search")).toBe(false);
  });

  it("works with full URL input", () => {
    setLocation("https://example.com/search");
    expect(isOnResultsPage("https://shop.com/search")).toBe(true);
  });

  it("returns false for different pathnames with full URL input", () => {
    setLocation("https://example.com/home");
    expect(isOnResultsPage("https://shop.com/search")).toBe(false);
  });

  it("matches with trailing slash on current page", () => {
    setLocation("https://example.com/search/");
    expect(isOnResultsPage("/search")).toBe(true);
  });

  it("matches with trailing slash in resultsPageUrl", () => {
    setLocation("https://example.com/search");
    expect(isOnResultsPage("/search/")).toBe(true);
  });
});

describe("buildTextSearchRedirectUrl", () => {
  it("appends query parameter to a pathname-based URL", () => {
    const result = buildTextSearchRedirectUrl("/search", "blue shoes");
    const url = new URL(result);
    expect(url.pathname).toBe("/search");
    expect(url.searchParams.get("query")).toBe("blue shoes");
  });

  it("appends query parameter to a full URL", () => {
    const result = buildTextSearchRedirectUrl(
      "https://shop.com/search",
      "red dress",
    );
    const url = new URL(result);
    expect(url.origin).toBe("https://shop.com");
    expect(url.pathname).toBe("/search");
    expect(url.searchParams.get("query")).toBe("red dress");
  });

  it("preserves existing query params in resultsPageUrl", () => {
    const result = buildTextSearchRedirectUrl("/search?lang=en", "jacket");
    const url = new URL(result);
    expect(url.searchParams.get("lang")).toBe("en");
    expect(url.searchParams.get("query")).toBe("jacket");
  });

  it("encodes special characters in the query", () => {
    const result = buildTextSearchRedirectUrl("/search", "hello world&more");
    expect(result).toContain("query=hello+world%26more");
  });
});

describe("buildImageSearchRedirectUrl", () => {
  it("appends searchId parameter to a pathname-based URL", () => {
    const result = buildImageSearchRedirectUrl("/search", "abc-123");
    const url = new URL(result);
    expect(url.pathname).toBe("/search");
    expect(url.searchParams.get("searchId")).toBe("abc-123");
  });

  it("appends searchId parameter to a full URL", () => {
    const result = buildImageSearchRedirectUrl(
      "https://shop.com/search",
      "xyz-456",
    );
    const url = new URL(result);
    expect(url.origin).toBe("https://shop.com");
    expect(url.searchParams.get("searchId")).toBe("xyz-456");
  });

  it("preserves existing query params in resultsPageUrl", () => {
    const result = buildImageSearchRedirectUrl("/search?lang=en", "abc-123");
    const url = new URL(result);
    expect(url.searchParams.get("lang")).toBe("en");
    expect(url.searchParams.get("searchId")).toBe("abc-123");
  });
});
