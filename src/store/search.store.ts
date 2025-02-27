import { createStore } from "@stencil/store";
import * as O from "fp-ts/lib/Option";
import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import { Recommendation } from "../interfaces/recommendation";
import {
  readFilters,
  SearchSession,
  SearchSessionFilter,
  DetectedObject,
  imageSearchSessionClient,
  textSearchSessionClient,
  SearchType,
  productListingPageSessionClient,
} from "../searchSession/searchSession";
import { foldValueObject, ValueObject } from "../network/ion/ValueObject";
import {
  Link,
  linkRequest,
  getLink,
  extractHrefValue,
  createLinkfromHref,
} from "../network/ion/Link";
import { divideOnSized, Rectangle } from "../geometry/Rectangle";
import { Form, formRequest } from "../network/ion/Form";
import * as F from "../network/ion/File";
import { sequenceToOption } from "../utils/option/option";
import {
  getTokenWithBody,
  processBearerToken,
} from "../utils/token/tokenUtils";
import { BasicError, detectObjectsError } from "../error";
import { sequenceToEither } from "../utils/either";
import { imageFormFromFile } from "../Image/form";
import { checkFileWithExtention, resizeFileTo } from "./file-processing";
import { imageFromFileTask } from "../Image/fromFile";
import {
  ProductListingPageRequest,
  ResponseFilterItem,
  TextSearchRequest,
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

const IMAGE_SMALLEST_SIDE_TO_RESIZE = 800;
const HI_RES_IMAGE_SMALLEST_SIDE_TO_RESIZE = 2000;

const makeAuthorizedRequest = (
  token: string,
): E.Either<BasicError<string>, RequestInit> =>
  pipe(
    token,
    processBearerToken,
    E.map((headers: Headers) => ({
      headers,
    })),
  );

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
  filters: SearchSessionFilter[];
  dynamicFilters: ResponseDynamicFilterItem[];
  resetCategoryLink?: Link;
  activeIonLink?: Link;
  rectangleSearchForm?: Form;
  detectedObjects: ValueObject<DetectedObject>[];
  objectDetectionInProgress: boolean;
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
  filters: [],
  dynamicFilters: [],
  detectedObjects: [],
  objectDetectionInProgress: false,
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
  (store: SearchStoreName, isSessionRequest = false) =>
  async (response: SearchSession) => {
    const state = useStore(store);
    state.selfSearchId = pipe(getLink(response, "self"), extractHrefValue);
    state.results = response.value;
    state.filters = readFilters(foldValueObject(response.filters));
    state.rectangleSearchForm = response.searchArea;
    state.resetCategoryLink = response.links?.clearFilters;
    if (!isSessionRequest) state.detectedObjects = response.detectedObjects;
    state.loading = false;
  };

const makeLinkRequest =
  (token: string) =>
  <T>(
    link: Link,
  ): TE.TaskEither<BasicError<Response | string>, ValueObject<T>> => {
    return pipe(
      makeAuthorizedRequest(token),
      TE.fromEither,
      TE.chainW(linkRequest<T>(link)),
    );
  };

const detectObjects =
  (store: SearchStoreName) =>
  (data: SearchSession): TE.TaskEither<BasicError<string | Response>, void> => {
    const state = useStore(store);
    state.objectDetectionInProgress = true;

    return pipe(
      getLink(data, "detectedObjects"),
      TE.fromOption(() => detectObjectsError),
      TE.chain(makeLinkRequest(state.token)),
      TE.map((objects: ValueObject<ValueObject<DetectedObject>[]>) => {
        state.detectedObjects = foldValueObject(objects);
        state.objectDetectionInProgress = false;
      }),
      TE.mapLeft((error) => {
        state.objectDetectionInProgress = false;
        return error;
      }),
    );
  };

export const uploadHiResFile =
  (store: SearchStoreName) =>
  async (sessionResponse: SearchSession, file: File) => {
    const state = useStore(store);
    const ionFile: F.IonFile = await F.fromFile(file);
    const formPayload = {
      image: ionFile,
    };

    const form = sessionResponse.uploadHighResolutionImage;

    await pipe(
      makeAuthorizedRequest(state.token),
      TE.fromEither,
      TE.chainW(formRequest<void>(form, formPayload)),
    )();
  };

export const makeRectangularSearchRequest = async (
  store: SearchStoreName,
  searchArea: Rectangle | null,
  imageBounds: Rectangle | null,
) => {
  const state = useStore(store);
  state.loading = true;
  pipe(
    sequenceToOption(O.fromNullable(imageBounds), O.fromNullable(searchArea)),
    O.map(async ([bounds, searchArea]) => {
      const scaled = divideOnSized(bounds)(searchArea);
      const searchRectangle = {
        width: scaled.width,
        height: scaled.height,
        left: scaled.x,
        top: scaled.y,
      };

      return await pipe(
        makeAuthorizedRequest(state.token),
        TE.fromEither,
        TE.chainW(formRequest(state.rectangleSearchForm, searchRectangle)),
        TE.map(updateImageSearchState(store)),
      )();
    }),
  );
};

export const uploadFile =
  (store: SearchStoreName) =>
  (file: File): TE.TaskEither<BasicError<string | Response>, SearchSession> => {
    const state = useStore(store);
    state.searchType = "image";
    state.loading = true;

    const fileForm = imageFormFromFile(file);

    const tokenWithFile = sequenceToEither(
      processBearerToken(state.token),
      E.right(fileForm),
    );

    return pipe(
      tokenWithFile,
      E.map(
        ([headers, body]): RequestInit => ({
          headers,
          body,
        }),
      ),
      TE.fromEither,
      TE.chain((request) =>
        imageSearchSessionClient(request, state.campaignId, state.excluded),
      ),
      TE.chain((sessionResponse) =>
        pipe(
          detectObjects(store)(sessionResponse),
          TE.map(() => {
            updateImageSearchState(store, true)(sessionResponse);
            state.loading = false;
            return sessionResponse;
          }),
        ),
      ),
      TE.mapLeft((error) => {
        state.serverError = true;
        state.loading = false;
        return error;
      }),
    );
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
    getTokenWithBody<TextSearchRequest>(state.token, body),
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

export const makeSearchIdRequest = async (token: string, searchId: string) => {
  return await pipe(
    makeAuthorizedRequest(token),
    TE.fromEither,
    TE.chainW(linkRequest(createLinkfromHref(searchId))),
    TE.map(updateImageSearchState("components")),
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
    getTokenWithBody<ProductListingPageRequest>(state.token, body),
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

    const session = await pipe(resizeFileTask, TE.chain(uploadFile(store)))();

    const hiResFileResizer = resizeFileTo(HI_RES_IMAGE_SMALLEST_SIDE_TO_RESIZE);
    const hiResFileTask = pipe(
      originFile,
      TE.fromEither,
      TE.chainTaskK(hiResFileResizer),
    );

    if (store === "components") {
      await pipe(
        hiResFileTask,
        TE.chainTaskK(imageFromFileTask),
        TE.map(setSelectedImage(store)),
      )();
    }

    const hiResFileResult = await hiResFileTask();
    pipe(
      sequenceToEither(session, hiResFileResult),
      E.map(([sessionObject, file]) =>
        uploadHiResFile(store)(sessionObject, file),
      ),
    );

    return session;
  };

onChangeWidgetState("activeIonLink", async (newLink: Link) => {
  const state = useStore("widget");
  const link = newLink ? newLink : state.resetCategoryLink;
  if (!link) return;
  state.loading = true;

  await pipe(
    makeAuthorizedRequest(state.token),
    TE.fromEither,
    TE.chainW(linkRequest(link)),
    TE.map(updateImageSearchState("widget")),
    TE.mapLeft((error) => {
      return {
        kind: "network error",
        inner: error,
      };
    }),
  )();
});

onChangeWidgetState("serverError", () => {
  const state = useStore("widget");
  state.loading = false;
});
