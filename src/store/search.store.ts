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
import type { ObservableMap } from "@stencil/store";

type OnChangeHandler<T> = ObservableMap<T>["onChange"];
import { applyResponseFilters } from "./helpers/applyResponseFilters";
import { startSearch } from "./helpers/searchSequence";
import { applyResultsPage } from "./helpers/applyResultsPage";
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
  productListingPageId: string | null;
  pageSize: number;
};

type ReceivedDataDefaults = {
  results: Recommendation[];
  sourceProduct: Recommendation | null;
  dynamicFilters: ResponseDynamicFilterItem[];
  detectedObjects: Rectangle[];
  stream: Stream | null;
  redirect: (Redirect & { query?: string; searchId?: string }) | null;
  resultsOffset: number;
  hasMoreResults: boolean;
  loadingMoreResults: boolean;
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
  productListingPageId: null,
  pageSize: 0,
};

const receivedDataDefaults: ReceivedDataDefaults = {
  results: [],
  sourceProduct: null,
  dynamicFilters: [],
  detectedObjects: [],
  stream: null,
  redirect: null,
  resultsOffset: 0,
  hasMoreResults: false,
  loadingMoreResults: false,
};

const storeDefaults: SearchStore = {
  ...appStateGlobalDefaults,
  ...appStateDefaults,
  ...receivedDataDefaults,
};

const widgetStore = createStore<SearchStore>(storeDefaults);
const searchState = widgetStore.state;
const onChangeWidgetState: OnChangeHandler<SearchStore> = widgetStore.onChange;

const componentsStore = createStore<SearchStore>(storeDefaults);
const componentsState = componentsStore.state;
const onChangeComponentsState: OnChangeHandler<SearchStore> =
  componentsStore.onChange;

const shopTheLookDefaults: SearchStore = {
  ...storeDefaults,
};

const shopTheLookStore = createStore<SearchStore>(shopTheLookDefaults);
const shopTheLookState = shopTheLookStore.state;
const onChangeShopTheLookState: OnChangeHandler<SearchStore> =
  shopTheLookStore.onChange;

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

/** A new result is on its way, so its load and view events are due again. */
export const resetResultEvents = (store: SearchStoreName) => {
  const state = useStore(store);
  state.resultLoaded = false;
  state.resultViewed = false;
};

export type ResetMode =
  | "appStateOnly"
  | "receivedDataOnly"
  | "appStateAndReceivedData"
  | "all";

/** `excludedFields` names the fields the reset leaves alone. */
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
  (store: SearchStoreName, isHiResUpdate: boolean, offset: number) =>
  async (response: VisualSearchResponse) => {
    const state = useStore(store);

    if (store === "shopTheLook") {
      state.visualSearchId = response.requestId;
      return;
    }

    applyResultsPage(state, response.data.products, offset);
    if (offset > 0) return;

    const detectedObjects = response.interactions.suggestedSearchAreas.map(
      ({ rectangle }) => rectangle,
    );
    if (detectedObjects.length > 0) state.detectedObjects = detectedObjects;

    state.visualSearchId = response.requestId;
    applyResponseFilters(state, response.interactions.dynamicFilters);
    state.redirect = response.interactions.redirect
      ? { ...response.interactions.redirect, searchId: response.requestId }
      : null;

    state.stream = response?.stream ?? null;
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
  (store: SearchStoreName, isStale: () => boolean) =>
  <E>(error: E): E => {
    // A stale failure would wipe the newer request's results and show an error over them.
    if (isStale()) return error;

    // Keep dynamicFilters: they pair with requestFilters, which this reset leaves in place.
    // Dropping only the facets would leave a filter applied with no chip to undo it.
    resetStore(store, "receivedDataOnly", ["dynamicFilters"]);
    const state = useStore(store);
    state.searchStatus = "error";
    return error;
  };

/** A failed next page leaves the list as it is, so the shopper can try again. */
const handleNextPageError =
  (store: SearchStoreName, isStale: () => boolean) =>
  <E>(error: E): E => {
    if (!isStale()) useStore(store).loadingMoreResults = false;
    return error;
  };

const handleRequestError = (
  store: SearchStoreName,
  offset: number,
  isStale: () => boolean,
) =>
  offset > 0
    ? handleNextPageError(store, isStale)
    : handleSearchError(store, isStale);

/** Where a search request goes and which campaign it is attributed to. */
export type SearchRequestOptions = {
  apiPath?: string;
  campaignId?: string | null;
};

const processVisualSearch = (
  store: SearchStoreName,
  body: VisualSearchRequest,
  token: string,
  apiPath?: string,
  isHiResUpdate: boolean = false,
) => {
  const isStale = startSearch(store);
  const offset = body.offset ?? 0;

  return pipe(
    getTokenWithBody<VisualSearchRequest>(token, body),
    setBodyAndHeaders,
    TE.fromEither,
    TE.chain((request) => visualSearchSessionClient(request, apiPath)),
    TE.map((sessionResponse) => {
      if (isStale()) return sessionResponse;

      updateVisualSearchState(store, isHiResUpdate, offset)(sessionResponse);
      return sessionResponse;
    }),
    TE.mapLeft(handleRequestError(store, offset, isStale)),
  );
};

type UploadImageOptions = SearchRequestOptions & {
  imageType?: ImageType;
  searchId?: string;
  isHiResUpdate?: boolean;
};

const uploadImageFile =
  (
    store: SearchStoreName,
    token: string,
    {
      apiPath,
      campaignId,
      imageType = "image",
      searchId,
      isHiResUpdate = false,
    }: UploadImageOptions = {},
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

export const makeVisualSearchByUrlRequest = async (
  store: SearchStoreName,
  imageUrl: string,
  token: string,
  { apiPath, campaignId }: SearchRequestOptions = {},
) => {
  const state = useStore(store);

  const body: VisualSearchRequest = {
    query: {
      url: imageUrl,
    },
    objectDetection: {
      include: true,
    },
    ...addNestedIfNotEmpty("staticFilters", {
      ...addIfNotEmpty("excluded", state.excluded),
    }),
    ...addIfNotEmpty(
      "campaign",
      campaignId || state.campaignIdVisualSearch || state.campaignId,
    ),
  };

  return processVisualSearch(store, body, token, apiPath)();
};

export const makeUploadFileRequest =
  (store: SearchStoreName, token: string, options: SearchRequestOptions = {}) =>
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

    const session = await uploadImageFile(store, token, options)(file)();

    if (!state.visualSearchId?.length) return session;

    const shouldProcessHiRes = await pipe(
      TE.fromTask(imageFromFileTask(file)),
      TE.map((img) => shouldResize(img, "highResolutionImage")),
      TE.getOrElse(() => T.of(false)),
    )();

    if (!shouldProcessHiRes) return session;

    pipe(
      uploadImageFile(store, token, {
        ...options,
        imageType: "highResolutionImage",
        searchId: state.visualSearchId,
        isHiResUpdate: true,
      })(file),
      TE.getOrElseW((error) => {
        console.error("Failed to upload hi-res image:", error);
        return T.of(session);
      }),
    )();

    return session;
  };

type PageOptions = {
  /** Number of results already received; set to load the page after them. */
  offset?: number;
};

export type VisualSearchOptions = SearchRequestOptions &
  PageOptions & {
    /**
     * Searching a new area: the applied filters belong to the previous result set, so they are
     * left out of this request. They stay in the store until the response reconciles them, so
     * the UI keeps showing the last selection the server confirmed.
     */
    dropAppliedFilters?: boolean;
  };

/** A next page keeps the list on screen while it loads, so it never enters the loading status. */
const startLoading = (state: SearchStore, offset: number) => {
  if (offset > 0) state.loadingMoreResults = true;
  else state.searchStatus = "loading";
};

export const makeVisualSearchRequest = async (
  store: SearchStoreName,
  searchId: string | null,
  token: string,
  {
    apiPath,
    campaignId,
    dropAppliedFilters,
    offset = 0,
  }: VisualSearchOptions = {},
) => {
  const state = useStore(store);
  state.textSearchQuery = null;
  state.searchType = "image";
  startLoading(state, offset);
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
    ...addIfNotEmpty(
      "dynamicFilters",
      dropAppliedFilters ? [] : state.requestFilters,
    ),
    ...(offset > 0 ? { offset } : {}),
    query: {
      ...addIfDefined("searchArea", searchRectangle),
    },
    ...addNestedIfNotEmpty("staticFilters", {
      ...addIfNotEmpty("excluded", state.excluded),
    }),
    objectDetection: {
      include: fetchDetectedObjects && offset === 0,
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

/** Where a text or listing search goes and which page of which result set to load. */
export type PagedSearchOptions = PageOptions & {
  apiPath?: string;
  requestId?: string | null;
  resultsCount?: number;
};

export type ProductListingPageOptions = PagedSearchOptions & {
  dynamicFilters?: RequestDynamicFilterItem[];
  skipStateUpdate?: boolean;
};

export const makeTextSearchRequest = async (
  store: SearchStoreName,
  query: string,
  token: string,
  { apiPath, requestId, resultsCount, offset = 0 }: PagedSearchOptions = {},
) => {
  const state = useStore(store);
  state.textSearchQuery = query;
  state.searchType = "text";
  startLoading(state, offset);

  const body: TextSearchRequest = {
    query,
    ...addIfDefined("requestId", requestId),
    ...addIfDefined("resultsCount", resultsCount),
    ...(offset > 0 ? { offset } : {}),
    ...addIfNotEmpty("dynamicFilters", state.requestFilters),
    ...addIfNotEmpty("campaign", state.campaignIdTextSearch),
    ...addNestedIfNotEmpty("staticFilters", {
      ...addIfNotEmpty("excluded", state.excluded),
    }),
  };

  const isStale = startSearch(store);

  return pipe(
    getTokenWithBody<TextSearchRequest>(token, body),
    setBodyAndHeaders,
    TE.fromEither,
    TE.chain((request) => textSearchSessionClient(request, apiPath)),
    TE.map((sessionResponse) => {
      if (isStale()) return sessionResponse;

      applyResultsPage(state, sessionResponse?.data?.products ?? [], offset);
      if (offset > 0) return sessionResponse;

      state.textSearchId = sessionResponse.requestId;
      applyResponseFilters(
        state,
        sessionResponse?.interactions?.dynamicFilters,
      );

      state.stream = sessionResponse?.stream ?? null;
      state.searchStatus = "success";
      emitSearchSuccess(store, state, "TPS");
      return sessionResponse;
    }),
    TE.mapLeft(handleRequestError(store, offset, isStale)),
  )();
};

export const makeProductListingPageRequest = async (
  column: string,
  value: string,
  token: string,
  {
    apiPath,
    requestId,
    resultsCount,
    dynamicFilters,
    skipStateUpdate,
    offset = 0,
  }: ProductListingPageOptions = {},
) => {
  const state = useStore("components");
  startLoading(state, offset);

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
    ...addIfDefined("requestId", requestId),
    ...(offset > 0 ? { offset } : {}),
  };

  const isStale = skipStateUpdate ? () => false : startSearch("components");

  return await pipe(
    getTokenWithBody<ProductListingPageRequest>(token, body),
    setBodyAndHeaders,
    TE.fromEither,
    TE.chainW((request) => productListingPageSessionClient(request, apiPath)),
    TE.map((sessionResponse) => {
      if (skipStateUpdate || isStale()) return sessionResponse;

      applyResultsPage(state, sessionResponse?.data?.products ?? [], offset);
      if (offset > 0) return sessionResponse;

      state.productListingPageId = sessionResponse?.requestId ?? null;
      state.dynamicFilters =
        sessionResponse?.interactions?.dynamicFilters ?? [];
      state.searchStatus = "success";
      emitSearchSuccess("components", state, "TPS");
      return sessionResponse;
    }),
    TE.mapLeft(handleRequestError("components", offset, isStale)),
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
  onCompletions?: (completions: QueryCompletion[]) => void,
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
      if (
        response.data.query.trim().toLowerCase() !==
        state.textSearchQuery?.trim().toLowerCase()
      )
        return response;

      const completions = response.data.completions ?? [];
      onCompletions?.(completions);

      const matchingCompletion = completions.find(
        (completion) =>
          completion.suggestion.trim().toLowerCase() ===
            query.trim().toLowerCase() && completion?.url,
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

export {
  onChangeComponentsState,
  onChangeWidgetState,
  onChangeShopTheLookState,
  searchState,
  componentsState,
  shopTheLookState,
};
