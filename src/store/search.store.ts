import { createStore } from "@stencil/store";
import * as O from "fp-ts/lib/Option";
import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import { Recommendation } from "../recommendation/recommendation";
import {
  readFilters,
  SearchSession,
  SearchSessionFilter,
  DetectedObject,
  imageSearchSessionClient,
  textSearchSessionClient,
  SearchType,
} from "../searchSession/searchSession";
import { foldValueObject, ValueObject } from "../network/ion/ValueObject";
import {
  Link,
  linkRequest,
  getLink,
  extractHrefValue,
  createLinkfromSearchId,
} from "../network/ion/Link";
import { divideOnSized, Rectangle } from "../geometry/Rectangle";
import { Form, formRequest } from "../network/ion/Form";
import * as F from "../network/ion/File";
import { sequenceToOption } from "../utils/option/option";
import { processBearerToken } from "../utils/token/tokenUtils";
import { BasicError } from "../error";
import { sequenceToEither } from "../utils/either";
import { imageFormFromFile } from "../Image/form";
import { checkFileWithExtention, resizeFileTo } from "./file-processing";
import { imageFromFileTask } from "../Image/fromFile";
import { RequestFilterItem, ResponseFilterItem } from "../interfaces/search";

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
  textSearchFilters: ResponseFilterItem[];
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
  textSearchFilters: [],
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

export const uploadFile = (
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
    E.map(([headers, body]): RequestInit => {
      return {
        headers,
        body,
      };
    }),
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

const uploadText = (query: string, dynamicFilters?: RequestFilterItem) => {
  state.searchType = "text";
  state.loading = true;

  const body = {
    query,
    ...(dynamicFilters
      ? {
          dynamicFilters,
        }
      : {}),
    ...(state.campaignId.length ? { campaign: state.campaignId } : {}),
  };

  const tokenWithBody = sequenceToEither(
    processBearerToken(state.token),
    E.right(JSON.stringify(body))
  );

  return pipe(
    tokenWithBody,
    E.map(([headers, body]): RequestInit => {
      headers.set("Content-Type", "application/json");
      return {
        headers,
        body,
      };
    }),
    TE.fromEither,
    TE.chain((request) => textSearchSessionClient(request)),
    TE.map((sessionResponse) => {
      state.results = sessionResponse?.data.products ?? [];
      state.textSearchFilters =
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
  );
};

export const processSelectedText = async (
  query: string,
  dynamicFilters?: RequestFilterItem
) => await uploadText(query, dynamicFilters)();

export const processSearchIdQuery = async (searchId: string, token: string) => {
  state.loading = true;
  return await pipe(
    makeAuthorizedRequest(token),
    TE.fromEither,
    TE.chainW(linkRequest(createLinkfromSearchId(searchId))),
    TE.map((response: ValueObject<Recommendation[]>) => {
      return response.value;
    }),
    TE.mapLeft((error) => {
      state.serverError = true;
      state.loading = false;
      return error;
    })
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

export const processSelectedFile = async (file: File) => {
  const originFile = checkFileWithExtention(file);

  const fileResizer = resizeFileTo(RESIZED_IMAGE_WIDTH);
  const hiResFileResizer = resizeFileTo(HI_RES_RESIZED_IMAGE_WIDTH);

  const resizeFileTask = pipe(
    originFile,
    TE.fromEither,
    TE.chainTaskK(fileResizer)
  );

  const resizeHiResFileTask = pipe(
    originFile,
    TE.fromEither,
    TE.chainTaskK(hiResFileResizer)
  );

  const session = await pipe(resizeFileTask, TE.chain(uploadFile))();

  await pipe(
    resizeFileTask,
    TE.chainTaskK(imageFromFileTask),
    TE.map(setSelectedImage)
  )();

  const resizedHiResFile = await resizeHiResFileTask();

  pipe(
    sequenceToEither(session, resizedHiResFile),
    E.map(([sessionObject, file]) => uploadHiResFile(sessionObject, file))
  );

  return session;
};
