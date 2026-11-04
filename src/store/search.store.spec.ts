import * as TE from "fp-ts/TaskEither";

import {
  makeProductListingPageRequest,
  makeTextSearchRequest,
  makeVisualSearchRequest,
  setTextSearchQuery,
  useSearchStore,
} from "./search.store";
import * as searchSession from "../searchSession/searchSession";

const products = { data: { products: [] } };

const respond = () => {
  jest
    .spyOn(searchSession, "textSearchSessionClient")
    .mockReturnValue(TE.right({ requestId: "text", ...products }) as never);
  jest.spyOn(searchSession, "visualSearchSessionClient").mockReturnValue(
    TE.right({
      requestId: "image",
      ...products,
      interactions: { suggestedSearchAreas: [] },
    }) as never,
  );
  jest
    .spyOn(searchSession, "productListingPageSessionClient")
    .mockReturnValue(TE.right(products) as never);
};

describe("resultsQuery", () => {
  const { state } = useSearchStore(false);

  beforeEach(respond);

  it("keeps the query of the search that returned the results", async () => {
    await makeTextSearchRequest("components", "red dress", "token");
    setTextSearchQuery("components", "blue sh");

    expect(state.resultsQuery).toBe("red dress");
  });

  it("clears the query once an image search returns", async () => {
    await makeTextSearchRequest("components", "red dress", "token");
    await makeVisualSearchRequest("components", "search-id", "token");

    expect(state.resultsQuery).toBeNull();
  });

  it("clears the query once a category listing returns", async () => {
    await makeTextSearchRequest("components", "red dress", "token");
    await makeProductListingPageRequest("product_type", "Shoes", "token");

    expect(state.resultsQuery).toBeNull();
  });
});
