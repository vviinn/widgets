import { createStore } from "@stencil/store";
import * as TE from "fp-ts/TaskEither";
import * as T from "fp-ts/Task";
import { pipe } from "fp-ts/function";
import { globalState } from "./store";
import {
  Recommendation,
  RequestStaticFilters,
} from "../interfaces/recommendation";
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
  addNestedIfNotEmpty,
} from "../utils/collections/collectionsUtils";
import { divideOnSized } from "../geometry/Rectangle";
import { fileToB64 } from "../file";
import { ImageType, shouldResize } from "./image-processing";
import { OnChangeHandler } from "@stencil/store/dist/types";

export type SearchStoreName = "widget" | "components";

type AppStateGlobalDefaults = {
  excluded?: RequestStaticFilters["excluded"] | null;
  campaignId: string;
};

type AppStateDefaults = {
  visualSearchId: string | null;
  textSearchId: string | null;
  searchType?: SearchType | null;
  resultLoaded: boolean;
  resultViewed: boolean;
  image?: HTMLImageElement | null;
  imageBounds?: Rectangle | null;
  searchArea?: Rectangle | null;
  croppedImageUrl?: string | null;
  requestFilters: RequestDynamicFilterItem[];
  loading: boolean;
  serverError: boolean;
};

type ReceivedDataDefaults = {
  results: Recommendation[];
  sourceProduct: Recommendation | null;
  dynamicFilters: ResponseDynamicFilterItem[];
  detectedObjects: Rectangle[];
};

export type SearchStore = AppStateGlobalDefaults &
  AppStateDefaults &
  ReceivedDataDefaults;

const appStateGlobalDefaults: AppStateGlobalDefaults = {
  excluded: null,
  campaignId: "",
};

const appStateDefaults: AppStateDefaults = {
  visualSearchId: null,
  textSearchId: null,
  searchType: null,
  resultLoaded: false,
  resultViewed: false,
  image: null,
  imageBounds: null,
  searchArea: null,
  croppedImageUrl: null,
  requestFilters: [],
  serverError: false,
  loading: false,
};

const receivedDataDefaults: ReceivedDataDefaults = {
  results: [],
  sourceProduct: null,
  dynamicFilters: [],
  detectedObjects: [],
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

const useStore = (store: SearchStoreName) =>
  store === "widget" ? searchState : componentsState;

export type ResetMode =
  | "appStateOnly"
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

const updateVisualSearchState =
  (store: SearchStoreName) => async (response: VisualSearchResponse) => {
    const state = useStore(store);

    const detectedObjects = response.interactions.suggestedSearchAreas.map(
      ({ rectangle }) => rectangle,
    );
    if (detectedObjects.length > 0) state.detectedObjects = detectedObjects;

    state.visualSearchId = response.requestId;
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
) => {
  const state = useStore(store);

  return pipe(
    getTokenWithBody<VisualSearchRequest>(globalState.token, body),
    setBodyAndHeaders,
    TE.fromEither,
    TE.chain((request) => visualSearchSessionClient(request)),
    TE.map((sessionResponse) => {
      updateVisualSearchState(store)(sessionResponse);
      return sessionResponse;
    }),
    TE.mapLeft((error) => {
      state.serverError = true;
      state.loading = false;
      return error;
    }),
  );
};

const uploadImageFile =
  (store: SearchStoreName, imageType: ImageType = "image", searchId?: string) =>
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
              ...addIfNotEmpty("campaign", state.campaignId),
            }),
            (error) => ({
              kind: "network error",
              inner: error,
            }),
          ),
          TE.chain((body) => processVisualSearch(store, body)),
        ),
      ),
    );
  };

export const makeUploadFileRequest =
  (store: SearchStoreName) => async (file: File) => {
    const state = useStore(store);

    Object.assign(state, {
      image: null,
      detectedObjects: [],
      searchType: "image",
      loading: true,
    });

    const session = await pipe(uploadImageFile(store, "image")(file))();
    state.loading = false;

    if (!state.visualSearchId?.length) return session;

    const shouldProcessHiRes = await pipe(
      TE.fromTask(imageFromFileTask(file)),
      TE.map((img) => shouldResize(img, "highResolutionImage")),
      TE.getOrElse(() => T.of(false)),
    )();

    if (!shouldProcessHiRes) return session;

    pipe(
      uploadImageFile(store, "highResolutionImage", state.visualSearchId)(file),
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
) => {
  const state = useStore(store);
  state.searchType = "image";
  state.loading = true;

  let searchRectangle: Rectangle | null = null;
  let fetchDetectedObjects = false;

  if (state.searchArea && state.imageBounds) {
    const scaled = divideOnSized(state.imageBounds)(state.searchArea);

    searchRectangle = {
      width: scaled.width,
      height: scaled.height,
      left: scaled.left,
      top: scaled.top,
    };
  } else {
    searchRectangle = {
      width: 1,
      height: 1,
      left: 0,
      top: 0,
    };
    fetchDetectedObjects = true;
  }

  const body: VisualSearchRequest = {
    requestId: searchId ?? state.visualSearchId,
    ...addIfNotEmpty("campaign", state.campaignId),
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
  return processVisualSearch(store, body)();
};

export const makeTextSearchRequest = async (
  store: SearchStoreName,
  query: string,
  requestId?: string | null,
  resultsCount?: number,
) => {
  const state = useStore(store);
  state.searchType = "text";
  state.loading = true;

  const body: TextSearchRequest = {
    query,
    ...addIfDefined("requestId", requestId),
    ...addIfDefined("resultsCount", resultsCount),
    ...addIfNotEmpty("dynamicFilters", state.requestFilters),
    ...addNestedIfNotEmpty("staticFilters", {
      ...addIfNotEmpty("excluded", state.excluded),
    }),
  };

  return pipe(
    getTokenWithBody<TextSearchRequest>(globalState.token, body),
    setBodyAndHeaders,
    TE.fromEither,
    TE.chain((request) => textSearchSessionClient(request)),
    TE.map((sessionResponse) => {
      state.results = sessionResponse?.data?.products ?? [];
      state.textSearchId = sessionResponse.requestId;
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

export {
  onChangeComponentsState,
  onChangeWidgetState,
  searchState,
  componentsState,
};
