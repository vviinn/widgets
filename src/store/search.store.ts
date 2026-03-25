import { createStore } from "@stencil/store";
import * as TE from "fp-ts/TaskEither";
import * as T from "fp-ts/Task";
import { pipe } from "fp-ts/function";
import {
  AutoSuggestRequest,
  QueryCompletion,
  Recommendation,
  RequestStaticFilters,
  Stream,
  Redirect,
} from "../interfaces";
import {
  autoSuggestClient,
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
  TextSearchRequest,
  VisualSearchRequest,
  VisualSearchResponse,
} from "../interfaces";
import {
  ResponseDynamicFilterItem,
  RequestDynamicFilterItem,
} from "../campaign/VPRCampaignService";
import { setBodyAndHeaders } from "../network/utils";
import { encodeToBase64UTF8 } from "../utils/string/encodeToBase64UTF8";
import {
  addIfDefined,
  addIfNotEmpty,
  addNestedIfNotEmpty,
} from "../utils/collections/collectionsUtils";
import { divideOnSized } from "../geometry/Rectangle";
import { fileToB64 } from "../file";
import { ImageType, shouldResize } from "./image-processing";
import { OnChangeHandler } from "@stencil/store/dist/types";
import { extractSelectedFilters } from "../components/vviinn-filters/helpers/extractSelectedFilters";
import { SearchSuccessEventData } from "../recommendation/events";
import { campaignTypeNames } from "../campaign/Campaign";
import { version } from "../../package.json";

export type SearchStoreName = "widget" | "components" | "shopTheLook";
export type SearchStatus = "idle" | "loading" | "success" | "error";

type AppStateGlobalDefaults = {
  excluded: RequestStaticFilters["excluded"] | null;
  campaignId: string;
  campaignIdTextSearch: string;
  campaignIdVisualSearch: string;
};

type AppStateDefaults = {
  visualSearchId: string | null;
  textSearchId: string | null;
  textSearchQuery: string | null;
  searchType: SearchType | null;
  searchStatus: SearchStatus;
  resultLoaded: boolean;
  resultViewed: boolean;
  image: HTMLImageElement | null;
  imageBounds: Rectangle | null;
  searchArea: Rectangle | null;
  croppedImageUrl: string | null;
  visualSearchStarted: boolean;
  requestFilters: RequestDynamicFilterItem[];
};

type ReceivedDataDefaults = {
  results: Recommendation[];
  sourceProduct: Recommendation | null;
  dynamicFilters: ResponseDynamicFilterItem[];
  detectedObjects: Rectangle[];
  stream: Stream | null;
  redirect: (Redirect & { query?: string }) | null;
  autoSuggestCompletions: QueryCompletion[];
};

export type SearchStore = AppStateGlobalDefaults &
  AppStateDefaults &
  ReceivedDataDefaults;

const appStateGlobalDefaults: AppStateGlobalDefaults = {
  excluded: null,
  campaignId: "",
  campaignIdTextSearch: "",
  campaignIdVisualSearch: "",
};

const appStateDefaults: AppStateDefaults = {
  visualSearchId: null,
  textSearchId: null,
  textSearchQuery: null,
  searchType: null,
  searchStatus: "idle",
  resultLoaded: false,
  resultViewed: false,
  image: null,
  imageBounds: null,
  searchArea: null,
  croppedImageUrl: null,
  visualSearchStarted: false,
  requestFilters: [],
};

const receivedDataDefaults: ReceivedDataDefaults = {
  results: [],
  sourceProduct: null,
  dynamicFilters: [],
  detectedObjects: [],
  stream: null,
  redirect: null,
  autoSuggestCompletions: [],
};

const storeDefaults: SearchStore = {
  ...appStateGlobalDefaults,
  ...appStateDefaults,
  ...receivedDataDefaults,
};

const { state: searchState, onChange: onChangeWidgetState } =
  createStore<SearchStore>(storeDefaults);
const { state: componentsState, onChange: onChangeComponentsState } =
  createStore<SearchStore>(storeDefaults);

const shopTheLookDefaults: SearchStore = {
  ...storeDefaults,
};

const { state: shopTheLookState, onChange: onChangeShopTheLookState } =
  createStore<SearchStore>(shopTheLookDefaults);

const useStore = (store: SearchStoreName): SearchStore => {
  switch (store) {
    case "widget":
      return searchState;
    case "components":
      return componentsState;
    case "shopTheLook":
      return shopTheLookState;
    default:
      throw new Error(`Unknown store name: ${store}`);
  }
};

export type ResetMode =
  | "appStateOnly"
  | "receivedDataOnly"
  | "appStateAndReceivedData"
  | "all"
  | "manual";

export const resetStore = (
  store: SearchStoreName,
  mode: ResetMode = "appStateAndReceivedData",
  excludedFields: (keyof SearchStore)[] = [],
) => {
  const state = useStore(store);

  let resetPayload: Partial<SearchStore> = {};

  switch (mode) {
    case "appStateOnly":
      resetPayload = { ...appStateDefaults };
      break;

    case "receivedDataOnly":
      resetPayload = { ...receivedDataDefaults };
      break;

    case "appStateAndReceivedData":
      resetPayload = {
        ...appStateDefaults,
        ...receivedDataDefaults,
      };
      break;

    case "all":
      resetPayload = { ...storeDefaults };
      break;

    case "manual":
      for (const key of excludedFields) {
        delete (state as any)[key];
      }
      return;
  }

  for (const key of excludedFields) {
    delete resetPayload[key];
  }
  Object.assign(state, resetPayload);
};

const emitSearchSuccess = (
  storeName: SearchStoreName,
  state: SearchStore,
  campaignTypeId: "VPS" | "TPS",
) => {
  const requestId =
    campaignTypeId === "VPS"
      ? state.visualSearchId || ""
      : state.textSearchId || "";

  const eventData: SearchSuccessEventData = {
    results: state.results,
    dynamicFilters: state.dynamicFilters,
    detectedObjects: state.detectedObjects,
    requestId,
    ...addIfDefined("query", state.textSearchQuery),
    storeName,
    campaignTypeId,
    campaignTypeName: campaignTypeNames[campaignTypeId],
    widgetVersion: version,
  };

  document.dispatchEvent(
    new CustomEvent("vviinnSearchSuccess", {
      detail: eventData,
      bubbles: true,
      composed: true,
    }),
  );
};

const updateVisualSearchState =
  (store: SearchStoreName, isHiResUpdate: boolean = false) =>
  async (response: VisualSearchResponse) => {
    const state = useStore(store);

    if (store === "shopTheLook") {
      state.visualSearchId = response.requestId;
      return;
    }

    const detectedObjects = response.interactions.suggestedSearchAreas.map(
      ({ rectangle }) => rectangle,
    );
    if (detectedObjects.length > 0) state.detectedObjects = detectedObjects;

    state.visualSearchId = response.requestId;
    state.results = response.data.products;
    state.dynamicFilters = response.interactions.dynamicFilters;
    state.searchStatus = "success";

    if (!isHiResUpdate) emitSearchSuccess(store, state, "VPS");
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

const handleSearchError =
  (store: SearchStoreName) =>
  <E>(error: E): E => {
    resetStore(store, "receivedDataOnly");
    const state = useStore(store);
    state.searchStatus = "error";
    return error;
  };

const processVisualSearch = (
  store: SearchStoreName,
  body: VisualSearchRequest,
  token: string,
  apiPath?: string,
  isHiResUpdate: boolean = false,
) => {
  return pipe(
    getTokenWithBody<VisualSearchRequest>(token, body),
    setBodyAndHeaders,
    TE.fromEither,
    TE.chain((request) => visualSearchSessionClient(request, apiPath)),
    TE.map((sessionResponse) => {
      updateVisualSearchState(store, isHiResUpdate)(sessionResponse);
      return sessionResponse;
    }),
    TE.mapLeft(handleSearchError(store)),
  );
};

const uploadImageFile =
  (
    store: SearchStoreName,
    token: string,
    imageType: ImageType = "image",
    searchId?: string,
    apiPath?: string,
    campaignId?: string | null,
    isHiResUpdate: boolean = false,
  ) =>
  (file: File) => {
    const state = useStore(store);
    return pipe(
      TE.fromEither(checkFileWithExtention(file)),
      TE.chainTaskK(resizeFileTo(imageType)),
      TE.chain((resizedFile) => updateImageState(store)(resizedFile)),
      TE.chain((resizedFile) =>
        pipe(
          TE.tryCatch(
            async () => ({
              query: {
                [imageType]: (await fileToB64(resizedFile)).split(",")[1],
              },
              objectDetection: {
                include: imageType === "image",
              },
              ...addNestedIfNotEmpty("staticFilters", {
                ...addIfNotEmpty("excluded", state.excluded),
              }),
              ...addIfDefined("requestId", searchId),
              ...addIfNotEmpty(
                "campaign",
                campaignId || state.campaignIdVisualSearch || state.campaignId,
              ),
            }),
            (error) => ({
              kind: "network error",
              inner: error,
            }),
          ),
          TE.chain((body) =>
            processVisualSearch(store, body, token, apiPath, isHiResUpdate),
          ),
        ),
      ),
    );
  };

export const makeUploadFileRequest =
  (
    store: SearchStoreName,
    token: string,
    apiPath?: string,
    campaignId?: string | null,
  ) =>
  async (file: File) => {
    const state = useStore(store);

    if (store !== "shopTheLook") {
      Object.assign(state, {
        image: null,
        detectedObjects: [],
        textSearchQuery: null,
        searchType: "image",
        searchStatus: "loading",
        visualSearchStarted: true,
      });
    }

    const session = await pipe(
      uploadImageFile(
        store,
        token,
        "image",
        undefined,
        apiPath,
        campaignId,
      )(file),
    )();

    if (!state.visualSearchId?.length) return session;

    const shouldProcessHiRes = await pipe(
      TE.fromTask(imageFromFileTask(file)),
      TE.map((img) => shouldResize(img, "highResolutionImage")),
      TE.getOrElse(() => T.of(false)),
    )();

    if (!shouldProcessHiRes) return session;

    pipe(
      uploadImageFile(
        store,
        token,
        "highResolutionImage",
        state.visualSearchId,
        apiPath,
        campaignId,
        true, // isHiResUpdate = true
      )(file),
      TE.getOrElseW((error) => {
        console.error("Failed to upload hi-res image:", error);
        return T.of(session);
      }),
    )();

    return session;
  };

export const makeVisualSearchRequest = async (
  store: SearchStoreName,
  searchId: string | null,
  token: string,
  apiPath?: string,
  campaignId?: string | null,
) => {
  const state = useStore(store);
  state.textSearchQuery = null;
  state.searchType = "image";
  state.searchStatus = "loading";
  state.visualSearchStarted = true;

  let searchRectangle: Rectangle | null = null;
  let fetchDetectedObjects = false;

  if (state.searchArea) {
    if (store === "shopTheLook") {
      searchRectangle = state.searchArea;
    } else if (state.searchArea && state.imageBounds) {
      const scaled = divideOnSized(state.imageBounds)(state.searchArea);
      searchRectangle = {
        width: scaled.width,
        height: scaled.height,
        left: scaled.left,
        top: scaled.top,
      };
    }
  } else {
    searchRectangle = null;
    fetchDetectedObjects = true;
  }

  const body: VisualSearchRequest = {
    ...addIfDefined("requestId", searchId ?? state.visualSearchId),
    ...addIfNotEmpty(
      "campaign",
      campaignId || state.campaignIdVisualSearch || state.campaignId,
    ),
    ...addIfNotEmpty("dynamicFilters", state.requestFilters),
    query: {
      ...addIfDefined("searchArea", searchRectangle),
    },
    ...addNestedIfNotEmpty("staticFilters", {
      ...addIfNotEmpty("excluded", state.excluded),
    }),
    objectDetection: {
      include: fetchDetectedObjects,
    },
  };
  return processVisualSearch(store, body, token, apiPath)();
};

export const setTextSearchQuery = (
  store: SearchStoreName,
  query: string | null | undefined,
) => {
  const state = useStore(store);
  state.textSearchQuery = query || null;
};

export const makeTextSearchRequest = async (
  store: SearchStoreName,
  query: string,
  token: string,
  apiPath?: string,
  requestId?: string | null,
  resultsCount?: number,
) => {
  const state = useStore(store);
  state.textSearchQuery = query;
  state.searchType = "text";
  state.searchStatus = "loading";

  const body: TextSearchRequest = {
    query,
    ...addIfDefined("requestId", requestId),
    ...addIfDefined("resultsCount", resultsCount),
    ...addIfNotEmpty("dynamicFilters", state.requestFilters),
    ...addIfNotEmpty("campaign", state.campaignIdTextSearch),
    ...addNestedIfNotEmpty("staticFilters", {
      ...addIfNotEmpty("excluded", state.excluded),
    }),
  };

  return pipe(
    getTokenWithBody<TextSearchRequest>(token, body),
    setBodyAndHeaders,
    TE.fromEither,
    TE.chain((request) => textSearchSessionClient(request, apiPath)),
    TE.map((sessionResponse) => {
      state.results = sessionResponse?.data?.products ?? [];
      state.textSearchId = sessionResponse.requestId;
      state.dynamicFilters =
        sessionResponse?.interactions?.dynamicFilters ?? [];

      const extractedFilters = extractSelectedFilters(
        sessionResponse?.interactions?.dynamicFilters ?? [],
      );

      if (state.requestFilters.length === 0 && extractedFilters.length > 0) {
        state.requestFilters = extractedFilters;
      }

      state.stream = sessionResponse?.stream ?? null;
      state.searchStatus = "success";
      emitSearchSuccess(store, state, "TPS");
      return sessionResponse;
    }),
    TE.mapLeft(handleSearchError(store)),
  )();
};

export const makeProductListingPageRequest = async (
  column: string,
  value: string,
  token: string,
  apiPath?: string,
  resultsCount?: number,
  dynamicFilters?: RequestDynamicFilterItem[],
  skipStateUpdate?: boolean,
) => {
  const state = useStore("components");
  state.searchStatus = "loading";

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
    getTokenWithBody<ProductListingPageRequest>(token, body),
    setBodyAndHeaders,
    TE.fromEither,
    TE.chainW((request) => productListingPageSessionClient(request, apiPath)),
    TE.map((sessionResponse) => {
      if (skipStateUpdate) return sessionResponse;
      state.results = sessionResponse?.data?.products ?? [];
      state.dynamicFilters =
        sessionResponse?.interactions?.dynamicFilters ?? [];
      state.searchStatus = "success";
      emitSearchSuccess("components", state, "TPS");
      return sessionResponse;
    }),
    TE.mapLeft(handleSearchError("components")),
  )();
};

export const useSearchStore = (
  showInWidget: boolean,
): {
  state: SearchStore;
  onChange: OnChangeHandler<SearchStore>;
  storeName: SearchStoreName;
} =>
  showInWidget
    ? {
        state: searchState,
        onChange: onChangeWidgetState,
        storeName: "widget",
      }
    : {
        state: componentsState,
        onChange: onChangeComponentsState,
        storeName: "components",
      };

export const makeAutoSuggestRequest = async (
  store: SearchStoreName,
  query: string,
  token: string,
  apiPath?: string,
) => {
  const state = useStore(store);
  const body: AutoSuggestRequest = {
    query,
  };

  return pipe(
    getTokenWithBody<AutoSuggestRequest>(token, body),
    setBodyAndHeaders,
    TE.fromEither,
    TE.chain((request) => autoSuggestClient(request, apiPath)),
    TE.map((response) => {
      if (response.data.query.toLowerCase() !== state.textSearchQuery?.toLowerCase()) return response;

      const completions = response.data.completions ?? [];
      state.autoSuggestCompletions = completions;

      const matchingCompletion = completions.find(
        (completion) =>
          completion.suggestion.toLowerCase() === query.toLowerCase() &&
          completion?.url,
      );

      if (matchingCompletion?.url) {
        state.redirect = { url: matchingCompletion.url, query };
      } else {
        state.redirect = null;
      }

      return response;
    }),
    TE.mapLeft((error) => error),
  )();
};

export const clearAutoSuggestCompletions = (store: SearchStoreName) => {
  const state = useStore(store);
  state.autoSuggestCompletions = [];
};

export {
  onChangeComponentsState,
  onChangeWidgetState,
  onChangeShopTheLookState,
  searchState,
  componentsState,
  shopTheLookState,
};
