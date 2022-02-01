import { createStore } from "@stencil/store";
import * as O from "fp-ts/lib/Option";
import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import { readFilters, searchSessionClient, } from "../searchSession/searchSession";
import { foldValueObject } from "../network/ion/ValueObject";
import { linkRequest, getLink } from "../network/ion/Link";
import { divideOnSized } from "../geometry/Rectangle";
import { formRequest } from "../network/ion/Form";
import * as F from "../network/ion/File";
import { fromRectangle } from "../cropper/Handler";
import { sequenceToOption } from "../utils/option/option";
import { processBearerToken } from "../utils/token/tokenUtils";
import { sequenceToEither } from "../utils/either";
import { imageFormFromFile } from "../Image/form";
import { checkFileWithExtention, resizeFileTo } from "./file-processing";
import { imageFromFileTask } from "../Image/fromFile";
const RESIZED_IMAGE_WIDTH = 500;
const makeAuthorizedRequest = (token) => pipe(token, processBearerToken, E.map((headers) => {
  return {
    headers,
  };
}));
const { state, onChange } = createStore({
  token: undefined,
  results: [],
  filters: [],
  resetCategoryLink: undefined,
  activeIonLink: undefined,
  cropperHandlers: [],
  selectedCropper: undefined,
  rectangleSearchForm: undefined,
  detectedObjects: [],
  detectedObject: undefined,
  objectDetectionInProgress: false,
  imageWidth: RESIZED_IMAGE_WIDTH,
  image: O.none,
  imageUrl: O.none,
  imageBounds: O.none,
  searchArea: O.none,
  resultsComponents: [],
  serverError: false,
  loading: false,
});
const updateState = async (response) => {
  var _a;
  state.results = response.value;
  state.filters = readFilters(foldValueObject(response.filters));
  state.rectangleSearchForm = response.searchArea;
  state.resetCategoryLink = (_a = response.links) === null || _a === void 0 ? void 0 : _a.clearFilters;
  state.loading = false;
};
const makeLinkRequest = (link) => {
  return pipe(makeAuthorizedRequest(state.token), TE.fromEither, TE.chainW(linkRequest(link)));
};
const detectObjects = async (data) => {
  state.objectDetectionInProgress = true;
  const error = {
    kind: "server",
    inner: "Can not get a link for objects detection",
  };
  await pipe(getLink(data, "detectedObjects"), TE.fromOption(() => error), TE.chain(makeLinkRequest), TE.map((objects) => (state.detectedObjects = foldValueObject(objects))))();
  state.objectDetectionInProgress = false;
};
export const uploadHiresFile = async (sessionResponse, file) => {
  const ionFile = await F.fromFile(file);
  const formPayload = {
    image: ionFile,
  };
  const form = sessionResponse.uploadHighResolutionImage;
  await pipe(makeAuthorizedRequest(state.token), TE.fromEither, TE.chainW(formRequest(form, formPayload)))();
};
export const makeRectangularSearchRequest = async () => {
  state.loading = true;
  pipe(sequenceToOption(state.imageBounds, state.searchArea), O.map(async ([bounds, searchArea]) => {
    const scaled = divideOnSized(bounds)(searchArea);
    const searchRectangle = {
      width: scaled.width,
      height: scaled.height,
      left: scaled.x,
      top: scaled.y,
    };
    return await pipe(makeAuthorizedRequest(state.token), TE.fromEither, TE.chainW(formRequest(state.rectangleSearchForm, searchRectangle)), TE.map(updateState))();
  }));
};
export const uploadFile = (file) => {
  state.loading = true;
  const fileForm = imageFormFromFile(file);
  const tokenWithFile = sequenceToEither(processBearerToken(state.token), E.right(fileForm));
  return pipe(tokenWithFile, E.map(([headers, body]) => {
    return {
      headers,
      body,
    };
  }), TE.fromEither, TE.chain(searchSessionClient), TE.map((sessionResponse) => {
    updateState(sessionResponse);
    detectObjects(sessionResponse);
    state.loading = false;
    return sessionResponse;
  }), TE.mapLeft((error) => {
    state.serverError = true;
    state.loading = false;
    return error;
  }));
};
export const imageSearchState = state;
onChange("activeIonLink", async (newLink) => {
  state.loading = true;
  const link = newLink ? newLink : state.resetCategoryLink;
  await pipe(makeAuthorizedRequest(state.token), TE.fromEither, TE.chainW(linkRequest(link)), TE.map(updateState), TE.mapLeft((error) => {
    return {
      kind: "network error",
      inner: error,
    };
  }))();
});
onChange("searchArea", (newSearchArea) => {
  pipe(newSearchArea, O.map((area) => {
    state.cropperHandlers = fromRectangle(area);
  }));
});
onChange("serverError", () => {
  state.loading = false;
});
const setSelectedImage = (image) => {
  imageSearchState.image = O.some(image);
  imageSearchState.imageUrl = O.some(image.src);
};
export const processSelectedFile = async (file) => {
  const originFile = checkFileWithExtention(file);
  const fileResizer = resizeFileTo(RESIZED_IMAGE_WIDTH);
  const resizeFileTask = pipe(originFile, TE.fromEither, TE.chainTaskK(fileResizer));
  const session = await pipe(resizeFileTask, TE.chain(uploadFile))();
  pipe(sequenceToEither(session, originFile), E.map(([sessionObject, file]) => uploadHiresFile(sessionObject, file)));
  await pipe(resizeFileTask, TE.chainTaskK(imageFromFileTask), TE.map(setSelectedImage))();
  return session;
};
