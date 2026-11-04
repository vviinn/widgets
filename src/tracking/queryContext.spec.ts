import { createQueryContext } from "./queryContext";

describe("createQueryContext", () => {
  it("carries the trimmed search term", () => {
    expect(createQueryContext({ query: "  red dress " })).toEqual({
      query: "red dress",
    });
  });

  it("carries the source product", () => {
    expect(createQueryContext({ sourceProductId: "SKU-1" })).toEqual({
      source_product_id: "SKU-1",
    });
  });

  it.each([undefined, null, "", "   "])(
    "leaves out a blank search term (%p)",
    (query) => {
      expect(createQueryContext({ query })).toEqual({});
    },
  );

  it("leaves out an empty source product", () => {
    expect(createQueryContext({ sourceProductId: "" })).toEqual({});
  });
});
