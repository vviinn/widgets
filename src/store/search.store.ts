import { createStore } from "@stencil/store";
import * as O from "fp-ts/lib/Option";
import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import { globalState } from "./store";
import { Recommendation } from "../interfaces/recommendation";
import {
  visualSearchSessionClient,
  textSearchSessionClient,
  SearchType,
  productListingPageSessionClient,
} from "../searchSession/searchSession";

import { getTokenWithBody } from "../utils/token/tokenUtils";
import { checkFileWithExtention, resizeFileTo } from "./file-processing";
import { imageFromFileTask } from "../Image/fromFile";
import {
  ProductListingPageRequest,
  Rectangle,
  ResponseFilterItem,
  TextSearchRequest,
  VisualSearchRequest,
  VisualSearchResponse,
} from "../interfaces/search";
import {
  ResponseDynamicFilterItem,
  RequestDynamicFilterItem,
} from "../campaign/VPRCampaignService";
import { setBodyAndHeaders } from "../network/utils";
import { encodeToBase64UTF8 } from "../utils/string";
import {
  addIfDefined,
  addIfNotEmpty,
} from "../utils/collections/collectionsUtils";
import { fileToB64 } from "../network/ion/File";
import { divideOnSized } from "../geometry/Rectangle";
import { Sized } from "../geometry/Sized";

const IMAGE_SMALLEST_SIDE_TO_RESIZE = 800;
const HI_RES_IMAGE_SMALLEST_SIDE_TO_RESIZE = 2000;

export type SearchStoreName = "widget" | "components";

export type SearchStore = {
  token?: string;
  campaignId?: string;
  excluded?: string;
  selfSearchId: string | null;
  results: Recommendation[];
  resultLoaded: boolean;
  resultViewed: boolean;
  sourceProduct: Recommendation | null;
  dynamicFilters: ResponseDynamicFilterItem[];
  detectedObjects: Rectangle[];
  searchType?: SearchType;
  image: O.Option<HTMLImageElement>;

  serverError: boolean;
  loading: boolean;
};

const storeDefaults: SearchStore = {
  campaignId: "",
  excluded: "",
  selfSearchId: null,
  results: [],
  sourceProduct: null,
  dynamicFilters: [],
  detectedObjects: [],
  resultLoaded: false,
  resultViewed: false,
  image: O.none,

  serverError: false,
  loading: false,
};

const { state: searchState, onChange: onChangeWidgetState } =
  createStore<SearchStore>(storeDefaults);
const { state: componentsState } = createStore<SearchStore>(storeDefaults);
export { searchState, componentsState };

const useStore = (store: SearchStoreName) =>
  store === "widget" ? searchState : componentsState;

export const resetStore = (store: SearchStoreName) => {
  const state = useStore(store);
  Object.assign(state, {
    ...storeDefaults,
    campaignId: state.campaignId,
    excluded: state.excluded,
  });
};

const updateImageSearchState =
  (store: SearchStoreName) => async (response: VisualSearchResponse) => {
    const state = useStore(store);
    state.detectedObjects = response.interactions.suggestedSearchAreas.map(
      ({ rectangle }) => rectangle,
    );
    state.selfSearchId = response.requestId;
    state.results = response.data.products;
    state.dynamicFilters = response.interactions.dynamicFilters;
    state.loading = false;
  };

const processVisualSearch = (
  store: SearchStoreName,
  body: VisualSearchRequest,
) => {
  const state = useStore(store);

  return pipe(
    getTokenWithBody<VisualSearchRequest>(globalState.token, body),
    setBodyAndHeaders,
    TE.fromEither,
    TE.chain((request) =>
      visualSearchSessionClient(request, state.campaignId, state.excluded),
    ),
    TE.map((sessionResponse) => {
      updateImageSearchState(store)(sessionResponse);
      state.loading = false;
      return sessionResponse;
    }),
    TE.mapLeft((error) => {
      state.serverError = true;
      state.loading = false;
      return error;
    }),
  );
};

export const uploadFile =
  (
    store: SearchStoreName,
    field: "image" | "highResolutionImage",
    searchId?: string,
  ) =>
  (file: File) => {
    const state = useStore(store);
    state.searchType = "image";
    state.loading = true;

    return pipe(
      TE.tryCatch(
        async () => ({
          query: {
            [field]: await fileToB64(file),
          },
          objectDetection: {
            include: field === "image" ? true : false,
          },
          ...addIfDefined("requestId", searchId),
        }),
        (error) => ({
          kind: "network error",
          inner: error,
        }),
      ),
      TE.chain((body) => processVisualSearch(store, body)),
    );
  };

export const makeRectangularSearchRequest = async (
  store: SearchStoreName,
  searchArea: Rectangle | null,
  imageBounds: Rectangle | null,
) => {
  const state = useStore(store);
  state.searchType = "image";
  state.loading = true;
  //FIXME: check type casting
  const scaled = divideOnSized(imageBounds as Sized)(searchArea);

  const searchRectangle = {
    width: scaled.width,
    height: scaled.height,
    left: scaled.left,
    top: scaled.top,
  };

  const body: VisualSearchRequest = {
    requestId: state.selfSearchId,
    query: {
      searchArea: searchRectangle,
    },
  };
  return processVisualSearch(store, body)();
};

export const makeSearchIdRequest = async (
  store: SearchStoreName,
  searchId: string,
) => {
  const state = useStore(store);
  state.searchType = "image";
  state.loading = true;

  const body: VisualSearchRequest = {
    requestId: searchId,
    query: {},
  };
  return processVisualSearch(store, body)();
};

export const makeTextSearchRequest = async (
  store: SearchStoreName,
  query: string,
  dynamicFilters?: RequestDynamicFilterItem[],
  requestId?: string,
  resultsCount?: number,
) => {
  const state = useStore(store);
  state.searchType = "text";
  state.loading = true;

  const body: TextSearchRequest = {
    query,
    requestId,
    ...addIfDefined("resultsCount", resultsCount),
    ...addIfDefined("dynamicFilters", dynamicFilters),
    ...addIfNotEmpty("campaign", state.campaignId),
  };

  return pipe(
    getTokenWithBody<TextSearchRequest>(globalState.token, body),
    setBodyAndHeaders,
    TE.fromEither,
    TE.chain((request) => textSearchSessionClient(request)),
    TE.map((sessionResponse) => {
      state.results = sessionResponse?.data?.products ?? [];
      state.dynamicFilters =
        (sessionResponse?.data?.interactions
          ?.dynamicFilters as ResponseFilterItem[]) ?? [];
      state.loading = false;
      return sessionResponse;
    }),
    TE.mapLeft((error) => {
      state.serverError = true;
      state.loading = false;
      return error;
    }),
  )();
};

export const makeProductListingPageRequest = async (
  column: string,
  value: string,
  resultsCount?: number,
  dynamicFilters?: RequestDynamicFilterItem[],
  skipStateUpdate?: boolean,
) => {
  const state = useStore("components");
  const requestValue =
    column === "product_type" || column === "google_product_category"
      ? pipe(
          value,
          (string) => string.split(" > ").join(">"),
          encodeToBase64UTF8,
          (base64String) => base64String.split("=")[0],
        )
      : value;

  const body: ProductListingPageRequest = {
    staticFilters: {
      included: [
        {
          column,
          values: [requestValue],
        },
      ],
    },
    ...addIfDefined("resultsCount", resultsCount),
    ...addIfDefined("dynamicFilters", dynamicFilters),
  };

  return await pipe(
    getTokenWithBody<ProductListingPageRequest>(globalState.token, body),
    setBodyAndHeaders,
    TE.fromEither,
    TE.chainW(productListingPageSessionClient),
    TE.map((sessionResponse) => {
      if (skipStateUpdate) return sessionResponse;
      state.results = sessionResponse?.data?.products ?? [];
      state.dynamicFilters =
        (sessionResponse?.interactions
          ?.dynamicFilters as ResponseFilterItem[]) ?? [];
      state.loading = false;
    }),
  )();
};

const setSelectedImage =
  (store: SearchStoreName) => (image: HTMLImageElement) => {
    const state = useStore(store);
    state.image = O.some(image);
  };

export const processSelectedFile =
  (store: SearchStoreName) => async (file: File) => {
    const state = useStore(store);
    state.image = O.none;
    state.detectedObjects = [];

    const originFile = checkFileWithExtention(file);

    const fileResizer = resizeFileTo(IMAGE_SMALLEST_SIDE_TO_RESIZE);
    const resizeFileTask = pipe(
      originFile,
      TE.fromEither,
      TE.chainTaskK(fileResizer),
    );

    await pipe(
      resizeFileTask,
      TE.chainTaskK(imageFromFileTask),
      TE.map(setSelectedImage(store)),
    )();

    const session = await pipe(
      resizeFileTask,
      TE.chain(uploadFile(store, "image")),
    )();

    const hiResFileResizer = resizeFileTo(HI_RES_IMAGE_SMALLEST_SIDE_TO_RESIZE);
    const hiResFileTask = pipe(
      originFile,
      TE.fromEither,
      TE.chainTaskK(hiResFileResizer),
    );

    const hiResFileResult = await hiResFileTask();

    if (store === "components") {
      await pipe(
        TE.fromEither(hiResFileResult),
        TE.chainTaskK(imageFromFileTask),
        TE.map(setSelectedImage(store)),
      )();
    }

    pipe(
      TE.fromEither(hiResFileResult),
      TE.chain(uploadFile(store, "highResolutionImage", state.selfSearchId)),
    )();
    return session;
  };

// TODO: check if this is needed
onChangeWidgetState("serverError", () => {
  const state = useStore("widget");
  state.loading = false;
});
