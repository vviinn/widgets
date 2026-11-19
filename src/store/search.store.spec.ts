// Stencil's transformer doesn't hoist jest.mock, so the mocks have to precede the imports.
jest.mock("../searchSession/searchSession", () => ({
  autoSuggestClient: jest.fn(),
  productListingPageSessionClient: jest.fn(),
  textSearchSessionClient: jest.fn(),
  visualSearchSessionClient: jest.fn(),
}));
jest.mock("./file-processing", () => ({
  checkFileWithExtention: (file: File) => ({ _tag: "Right", right: file }),
  resizeFileTo: () => (file: File) => () => Promise.resolve(file),
}));
jest.mock("../Image/fromFile", () => ({
  imageFromFileTask: () => () => Promise.resolve({}),
}));
jest.mock("./image-processing", () => ({ shouldResize: jest.fn() }));
jest.mock("../file", () => ({
  fileToB64: () => Promise.resolve("data:image/png;base64,AAAA"),
}));

import * as E from "fp-ts/Either";
import type { Recommendation } from "../interfaces";
import {
  productListingPageSessionClient,
  textSearchSessionClient,
  visualSearchSessionClient,
} from "../searchSession/searchSession";
import { shouldResize } from "./image-processing";
import {
  makeProductListingPageRequest,
  makeTextSearchRequest,
  makeUploadFileRequest,
  resetStore,
  useSearchStore,
} from "./search.store";

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

type Answer = (response: E.Either<unknown, unknown>) => void;

/** Holds each request open until the test answers it, and keeps the bodies sent. */
const mockClient = (client: unknown) => {
  const bodies: Record<string, unknown>[] = [];
  const answers: Answer[] = [];
  (client as jest.Mock).mockImplementation((init: RequestInit) => {
    bodies.push(JSON.parse(init.body as string));
    const response = new Promise<E.Either<unknown, unknown>>((resolve) =>
      answers.push(resolve),
    );
    return () => response;
  });
  /** The client is called a few microtasks after the request starts. */
  const respond = async (
    index: number,
    response: E.Either<unknown, unknown>,
  ) => {
    await flush();
    answers[index](response);
  };
  return { bodies, respond };
};

const page = (requestId: string, ...ids: string[]) =>
  E.right({
    requestId,
    data: {
      products: ids.map((productId) => ({ productId }) as Recommendation),
    },
    interactions: { dynamicFilters: [], suggestedSearchAreas: [] },
  });

const failure = E.left({ kind: "network error" });

const state = useSearchStore(false).state;
const ids = () => state.results.map(({ productId }) => productId);

beforeEach(() => {
  jest.clearAllMocks();
  resetStore("components");
});

afterEach(() => jest.restoreAllMocks());

describe("makeTextSearchRequest", () => {
  const searchFirstPage = async () => {
    const client = mockClient(textSearchSessionClient);
    const request = makeTextSearchRequest("components", "sofa", "token");
    await client.respond(0, page("t1", "a", "b"));
    await request;
    return client;
  };
  const nextPage = () =>
    makeTextSearchRequest("components", "sofa", "token", {
      requestId: "t1",
      offset: 2,
    });

  it("asks for a next page with the first page's request ID and the offset", async () => {
    const { bodies, respond } = await searchFirstPage();

    const request = nextPage();
    await respond(1, page("t1", "c", "d"));
    await request;

    expect(bodies[0]).not.toHaveProperty("offset");
    expect(bodies[1]).toMatchObject({
      query: "sofa",
      requestId: "t1",
      offset: 2,
    });
    expect(ids()).toEqual(["a", "b", "c", "d"]);
    expect(state.loadingMoreResults).toBe(false);
  });

  it("keeps the list when a next page fails, so the shopper can try again", async () => {
    const { respond } = await searchFirstPage();

    const request = nextPage();
    expect(state.loadingMoreResults).toBe(true);
    await respond(1, failure);
    await request;

    expect(ids()).toEqual(["a", "b"]);
    expect(state.searchStatus).toBe("success");
    expect(state.loadingMoreResults).toBe(false);
  });

  it("drops a next page that answers after a new search started", async () => {
    const { respond } = await searchFirstPage();

    const loadingPage = nextPage();
    const newSearch = makeTextSearchRequest("components", "lamp", "token");
    expect(state.loadingMoreResults).toBe(false);

    await respond(2, page("t2", "x"));
    await newSearch;
    await respond(1, page("t1", "c", "d"));
    await loadingPage;

    expect(ids()).toEqual(["x"]);
    expect(state.loadingMoreResults).toBe(false);
  });

  it("keeps a query typed in the field when the search on screen is refreshed", async () => {
    await searchFirstPage();
    state.textSearchQuery = "lamp";

    makeTextSearchRequest("components", "sofa", "token", { requestId: "t1" });

    expect(state.textSearchQuery).toBe("lamp");
    expect(state.searchedTextQuery).toBe("sofa");
  });
});

describe("makeProductListingPageRequest", () => {
  it("asks for a next page with the listing's request ID, filters and offset", async () => {
    const { bodies, respond } = mockClient(productListingPageSessionClient);
    const filters = [{ column: "color", values: ["schwarz"] }];

    const firstPage = makeProductListingPageRequest("brand", "drop", "token", {
      dynamicFilters: filters,
    });
    await respond(0, page("l1", "a", "b"));
    await firstPage;

    const secondPage = makeProductListingPageRequest("brand", "drop", "token", {
      requestId: state.productListingPageId,
      dynamicFilters: filters,
      offset: 2,
    });
    await respond(1, page("l1", "c"));
    await secondPage;

    expect(bodies[0]).not.toHaveProperty("offset");
    expect(bodies[1]).toMatchObject({
      requestId: "l1",
      dynamicFilters: filters,
      offset: 2,
    });
    expect(ids()).toEqual(["a", "b", "c"]);
    expect(state.hasMoreResults).toBe(false);
  });
});

describe("hiResPending", () => {
  const upload = () => makeUploadFileRequest("components", "token")({} as File);
  const setup = (hiRes: boolean) => {
    (shouldResize as jest.Mock).mockReturnValue(hiRes);
    return mockClient(visualSearchSessionClient);
  };

  it("clears at once when the photo is too small for a hi-res search", async () => {
    const { respond } = setup(false);

    const uploading = upload();
    expect(state.hiResPending).toBe(true);
    await respond(0, page("v1", "a", "b"));
    await uploading;

    expect(state.hiResPending).toBe(false);
  });

  it("holds until the hi-res search answers", async () => {
    const { bodies, respond } = setup(true);

    const uploading = upload();
    await respond(0, page("v1", "a", "b"));
    await uploading;
    await flush();
    expect(bodies[1].query).toHaveProperty("highResolutionImage");
    expect(state.hiResPending).toBe(true);

    await respond(1, page("v1", "a", "b", "c"));
    await flush();

    expect(state.hiResPending).toBe(false);
  });

  it("clears when the hi-res search fails", async () => {
    const { respond } = setup(true);
    jest.spyOn(console, "error").mockImplementation(() => undefined);

    const uploading = upload();
    await respond(0, page("v1", "a", "b"));
    await uploading;
    await respond(1, failure);
    await flush();

    expect(state.hiResPending).toBe(false);
  });

  it("sends no hi-res search for an upload a newer one overtook", async () => {
    const { bodies, respond } = setup(true);

    const first = upload();
    const second = upload();
    await respond(1, page("v2", "b"));
    await second;
    await respond(0, page("v1", "a"));
    await first;
    await flush();

    const hiResIds = bodies
      .filter(({ query }) => "highResolutionImage" in (query as object))
      .map(({ requestId }) => requestId);
    expect(hiResIds).toEqual(["v2"]);
  });

  it("stays set for a newer upload when an older hi-res search answers", async () => {
    const { respond } = setup(true);

    const first = upload();
    await respond(0, page("v1", "a", "b"));
    await first;
    const second = upload();
    await respond(1, page("v1", "a", "b"));
    await flush();

    expect(state.hiResPending).toBe(true);

    await respond(2, page("v2", "c", "d"));
    await second;
    await respond(3, page("v2", "c", "d"));
    await flush();

    expect(state.hiResPending).toBe(false);
  });
});
