import { createStore } from "@stencil/store";
import * as TE from "fp-ts/TaskEither";
import * as T from "fp-ts/Task";
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
import { divideOnSized } from "../geometry/Rectangle";
import { fileToB64 } from "../file";
import { imageProcessingConfig, shouldResize } from "./image-processing";

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
  image?: HTMLImageElement | null;

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
  image: null,

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

const updateVisualSearchState =
  (store: SearchStoreName, updateDetectedObjects) =>
  async (response: VisualSearchResponse) => {
    const state = useStore(store);
    if (updateDetectedObjects)
      state.detectedObjects = response.interactions.suggestedSearchAreas.map(
        ({ rectangle }) => rectangle,
      );

    state.selfSearchId = response.requestId;
    state.results = response.data.products;
    state.dynamicFilters = response.interactions.dynamicFilters;
    state.loading = false;
  };

const updateImageState = (store: SearchStoreName) => (file: File) =>
  pipe(
    TE.fromTask(imageFromFileTask(file)),
    TE.map((image) => {
      const state = useStore(store);
      state.image = image;
      return image;
    }),
    TE.map(() => file),
  );

const processVisualSearch = (
  store: SearchStoreName,
  body: VisualSearchRequest,
  fetchDetectedObjects = true,
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
      updateVisualSearchState(store, fetchDetectedObjects)(sessionResponse);
      return sessionResponse;
    }),
    TE.mapLeft((error) => {
      state.serverError = true;
      state.loading = false;
      return error;
    }),
  );
};

const uploadFile =
  (
    store: SearchStoreName,
    field: "image" | "highResolutionImage",
    fetchDetectedObjects: boolean = true,
    searchId?: string,
  ) =>
  (file: File) => {
    return pipe(
      TE.tryCatch(
        async () => ({
          query: {
            [field]: (await fileToB64(file)).split(",")[1],
          },
          objectDetection: {
            include: field === "image",
          },
          ...addIfDefined("requestId", searchId),
        }),
        (error) => ({
          kind: "network error",
          inner: error,
        }),
      ),
      TE.chain((body) =>
        processVisualSearch(store, body, fetchDetectedObjects),
      ),
    );
  };

const uploadImage = (store: SearchStoreName, size: number) => (file: File) =>
  pipe(
    TE.fromEither(checkFileWithExtention(file)),
    TE.chainTaskK(resizeFileTo(size)),
    TE.chain((resizedFile) => updateImageState(store)(resizedFile)),
    TE.chain(uploadFile(store, "image")),
  );

export const makeUploadFileRequest =
  (store: SearchStoreName) => async (file: File) => {
    const state = useStore(store);
    const { previewSize, hiResSize } = imageProcessingConfig;

    Object.assign(state, {
      image: null,
      detectedObjects: [],
      searchType: "image",
      loading: true,
    });

    const session = await pipe(uploadImage(store, previewSize)(file))();
    state.loading = false;

    if (!state.selfSearchId?.length) return session;

    const shouldProcessHiRes = await pipe(
      TE.fromTask(imageFromFileTask(file)),
      TE.map((img) => shouldResize(img, hiResSize)),
      TE.getOrElse(() => T.of(false)),
    )();

    if (!shouldProcessHiRes) return session;

    pipe(
      uploadImage(store, hiResSize)(file),
      TE.getOrElseW((error) => {
        console.error("Failed to upload hi-res image:", error);
        return T.of(session);
      }),
    )();

    return session;
  };

export const makeVisualSearchRequest = async (
  store: SearchStoreName,
  searchId?: string | null,
  dynamicFilters?: RequestDynamicFilterItem[],
  searchArea?: Rectangle | null,
  imageBounds?: Rectangle | null,
) => {
  const state = useStore(store);
  state.searchType = "image";
  state.loading = true;

  let searchRectangle: Rectangle;

  if (imageBounds) {
    const scaled = divideOnSized(imageBounds)(searchArea);

    searchRectangle = {
      width: scaled.width,
      height: scaled.height,
      left: scaled.left,
      top: scaled.top,
    };
  }

  const body: VisualSearchRequest = {
    requestId: searchId ?? state.selfSearchId,
    ...addIfNotEmpty("dynamicFilters", dynamicFilters),
    query: {
      ...addIfDefined("searchArea", searchRectangle),
    },
  };
  return processVisualSearch(store, body, false)();
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
    ...addIfNotEmpty("dynamicFilters", dynamicFilters),
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
        (sessionResponse?.interactions
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

onChangeWidgetState("serverError", () => {
  const state = useStore("widget");
  state.loading = false;
});
