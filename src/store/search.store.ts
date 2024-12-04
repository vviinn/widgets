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
import { BasicError } from "../error";
import { sequenceToEither } from "../utils/either";
import { imageFormFromFile } from "../Image/form";
import { checkFileWithExtention, resizeFileTo } from "./file-processing";
import { imageFromFileTask } from "../Image/fromFile";
import {
  ProductListingPageRequest,
  ResponseFilterItem,
  SearchIdResponse,
  TextSearchRequest,
} from "../interfaces/search";
import {
  ResponseDynamicFilterItem,
  RequestDynamicFilterItem,
} from "../campaign/VPRCampaignService";
import { setBodyAndHeaders } from "../network/utils";
import { encodeToBase64UTF8 } from "../utils/string";

const RESIZED_IMAGE_WIDTH = 500;
const HI_RES_RESIZED_IMAGE_WIDTH = 1024;

const makeAuthorizedRequest = (
  token: string
): E.Either<BasicError<string>, RequestInit> =>
  pipe(
    token,
    processBearerToken,
    E.map((headers: Headers) => {
      return {
        headers,
      };
    })
  );

type SearchStore = {
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
  selectedCropper?: number;
  rectangleSearchForm?: Form;
  detectedObjects: ValueObject<DetectedObject>[];
  detectedObject?: ValueObject<DetectedObject>;
  objectDetectionInProgress: boolean;
  imageWidth: number;
  searchType?: SearchType;

  image: O.Option<HTMLImageElement>;
  imageUrl: O.Option<string>;
  imageBounds: O.Option<Rectangle>;
  searchArea: O.Option<Rectangle>;

  serverError: boolean;
  loading: boolean;
};

const { state, onChange } = createStore<SearchStore>({
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

  imageWidth: RESIZED_IMAGE_WIDTH,

  image: O.none,
  imageUrl: O.none,
  imageBounds: O.none,
  searchArea: O.none,

  serverError: false,
  loading: false,
});

export const searchState = state;

const updateState = async (response: SearchSession) => {
  state.selfSearchId = pipe(getLink(response, "self"), extractHrefValue);
  state.results = response.value;
  state.filters = readFilters(foldValueObject(response.filters));
  state.rectangleSearchForm = response.searchArea;
  state.resetCategoryLink = response.links?.clearFilters;
  state.loading = false;
};

const makeLinkRequest = <T>(
  link: Link
): TE.TaskEither<BasicError<Response | string>, ValueObject<T>> => {
  return pipe(
    makeAuthorizedRequest(state.token),
    TE.fromEither,
    TE.chainW(linkRequest<T>(link))
  );
};

const detectObjects = async (data: SearchSession) => {
  state.objectDetectionInProgress = true;

  const error: BasicError<string> = {
    kind: "server",
    inner: "Can not get a link for objects detection",
  };

  await pipe(
    getLink(data, "detectedObjects"),
    TE.fromOption(() => error),
    TE.chain(makeLinkRequest),
    TE.map(
      (objects: ValueObject<ValueObject<DetectedObject>[]>) =>
        (state.detectedObjects = foldValueObject(objects))
    )
  )();

  state.objectDetectionInProgress = false;
};

export const uploadHiResFile = async (
  sessionResponse: SearchSession,
  file: File
) => {
  const ionFile: F.IonFile = await F.fromFile(file);
  const formPayload = {
    image: ionFile,
  };

  const form = sessionResponse.uploadHighResolutionImage;

  await pipe(
    makeAuthorizedRequest(state.token),
    TE.fromEither,
    TE.chainW(formRequest<void>(form, formPayload))
  )();
};

export const makeRectangularSearchRequest = async () => {
  state.loading = true;
  pipe(
    sequenceToOption(state.imageBounds, state.searchArea),
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
        TE.map(updateState)
      )();
    })
  );
};

export const uploadFileFromTextSearch = (
  file: File,
  token: string,
  apiPath: string
) => {
  const fileForm = imageFormFromFile(file);

  const tokenWithFile = sequenceToEither(
    processBearerToken(token),
    E.right(fileForm)
  );

  return pipe(
    tokenWithFile,
    E.map(
      ([headers, body]): RequestInit => ({
        headers,
        body,
      })
    ),
    TE.fromEither,
    TE.chain((request) =>
      imageSearchSessionClient(request, null, null, apiPath)
    )
  );
};

export const uploadFileFromWidget = (
  file: File
): TE.TaskEither<BasicError<string | Response>, SearchSession> => {
  state.searchType = "image";
  state.loading = true;

  const fileForm = imageFormFromFile(file);

  const tokenWithFile = sequenceToEither(
    processBearerToken(state.token),
    E.right(fileForm)
  );

  return pipe(
    tokenWithFile,
    E.map(
      ([headers, body]): RequestInit => ({
        headers,
        body,
      })
    ),
    TE.fromEither,
    TE.chain((request) =>
      imageSearchSessionClient(request, state.campaignId, state.excluded)
    ),
    TE.map((sessionResponse) => {
      updateState(sessionResponse);
      detectObjects(sessionResponse);
      state.loading = false;
      return sessionResponse;
    }),
    TE.mapLeft((error) => {
      state.serverError = true;
      state.loading = false;
      return error;
    })
  );
};

export const makeTextSearchRequest = async (
  token: string,
  query: string,
  dynamicFilters?: RequestDynamicFilterItem[],
  requestId?: string
) => {
  state.searchType = "text";
  state.loading = true;

  const body: TextSearchRequest = {
    query,
    ...(dynamicFilters
      ? {
          dynamicFilters,
        }
      : {}),
    ...(state.campaignId.length ? { campaign: state.campaignId } : {}),
    requestId,
  };

  return pipe(
    getTokenWithBody<TextSearchRequest>(token, body),
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
    })
  )();
};

export const makeSearchQueryRequest = async (
  token: string,
  query: string,
  dynamicFilters?: RequestDynamicFilterItem[],
  resultsCount?: number,
  requestId?: string
) => {
  const body: TextSearchRequest = {
    query,
    ...(resultsCount ? { resultsCount } : {}),
    ...(requestId ? { requestId } : {}),
    ...(dynamicFilters
      ? {
          dynamicFilters,
        }
      : {}),
  };

  return pipe(
    getTokenWithBody<TextSearchRequest>(token, body),
    setBodyAndHeaders,
    TE.fromEither,
    TE.chain(textSearchSessionClient)
  )();
};

export const makeSearchIdRequest = async (token: string, searchId: string) =>
  await pipe(
    makeAuthorizedRequest(token),
    TE.fromEither,
    TE.chainW(linkRequest(createLinkfromHref(searchId))),
    TE.map((response: ValueObject<SearchIdResponse>) => response.value)
  )();

export const makeProductListingPageRequest = async (
  token: string,
  column: string,
  value: string,
  resultsCount?: number,
  dynamicFilters?: RequestDynamicFilterItem[]
) => {
  const requestValue =
    column === "product_type" || column === "google_product_category"
      ? pipe(
          value,
          (string) => string.split(" > ").join(">"),
          encodeToBase64UTF8,
          (base64String) => base64String.split("=")[0]
        )
      : value;

  const body: ProductListingPageRequest = {
    ...(resultsCount ? { resultsCount } : {}),
    staticFilters: {
      included: [
        {
          column,
          values: [requestValue],
        },
      ],
    },
    ...(dynamicFilters
      ? {
          dynamicFilters,
        }
      : {}),
  };

  return pipe(
    getTokenWithBody<ProductListingPageRequest>(token, body),
    setBodyAndHeaders,
    TE.fromEither,
    TE.chain(productListingPageSessionClient)
  )();
};

onChange("activeIonLink", async (newLink: Link) => {
  const link = newLink ? newLink : state.resetCategoryLink;
  if (!link) return;
  state.loading = true;

  await pipe(
    makeAuthorizedRequest(state.token),
    TE.fromEither,
    TE.chainW(linkRequest(link)),
    TE.map(updateState),
    TE.mapLeft((error) => {
      return {
        kind: "network error",
        inner: error,
      };
    })
  )();
});

onChange("serverError", () => {
  state.loading = false;
});

const setSelectedImage = (image: HTMLImageElement) => {
  searchState.image = O.some(image);
  searchState.imageUrl = O.some(image.src);
};

export const processSelectedFile = async (
  file: File,
  fromTextSearch: boolean = false,
  token?: string,
  apiPath?: string
) => {
  const originFile = checkFileWithExtention(file);

  const fileResizer = resizeFileTo(RESIZED_IMAGE_WIDTH);
  const resizeFileTask = pipe(
    originFile,
    TE.fromEither,
    TE.chainTaskK(fileResizer)
  );

  if (fromTextSearch)
    return await pipe(
      resizeFileTask,
      TE.chain(() => uploadFileFromTextSearch(file, token, apiPath))
    )();

  const session = await pipe(resizeFileTask, TE.chain(uploadFileFromWidget))();

  await pipe(
    resizeFileTask,
    TE.chainTaskK(imageFromFileTask),
    TE.map(setSelectedImage)
  )();

  const hiResFileResizer = resizeFileTo(HI_RES_RESIZED_IMAGE_WIDTH);
  const resizeHiResFileTask = pipe(
    originFile,
    TE.fromEither,
    TE.chainTaskK(hiResFileResizer)
  );

  const resizedHiResFile = await resizeHiResFileTask();

  pipe(
    sequenceToEither(session, resizedHiResFile),
    E.map(([sessionObject, file]) => uploadHiResFile(sessionObject, file))
  );

  return session;
};
