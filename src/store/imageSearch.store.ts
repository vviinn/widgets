import { createStore } from "@stencil/store";
//import * as O from "fp-ts/lib/Option";
import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import { Recommendation } from "../recommendation/recommendation";
import { existAndNotEmpty } from "../utils/collections/collectionsUtils";
import { createBearerHeaders } from "../utils/token/tokenUtils";
import { NetworkError, networkErrorFrom } from "../network/request";
import {
  readFilters,
  SearchSession,
  searchSessionClient,
  SearchSessionFilter,
  DetectedObject,
} from "../searchSession/searchSession";
import { foldValueObject, ValueObject } from "../network/ion/ValueObject";
import { Link, linkRequest, getLink } from "../network/ion/Link";
import { divideOnSized, move, Rectangle } from "../geometry/Rectangle";
import { Form, formRequest } from "../network/ion/Form";
import { fromFile } from "../Image/fromFile";
import { resizeImage } from "../Image/resizeImage";
import { toFile } from "../Image/toFile";

const RESIZED_IMAGE_WIDTH = 300;

const composeSearchSessionData = (
  token: string,
  file: File
): E.Either<NetworkError, RequestInit> =>
  pipe(
    token,
    existAndNotEmpty,
    E.map((token) => {
      const body = new FormData();
      body.append("image", file);
      return {
        headers: createBearerHeaders(token),
        body,
      };
    }),
    E.mapLeft(networkErrorFrom)
  );

const composeAuth = (token: string): E.Either<NetworkError, RequestInit> =>
  pipe(
    token,
    existAndNotEmpty,
    E.map((token) => {
      return {
        headers: createBearerHeaders(token),
      };
    }),
    E.mapLeft(networkErrorFrom)
  );

type ImageSearchStore = {
  token: string | undefined;
  image: File | undefined;
  resizedImageUrl: string | undefined;
  results: Recommendation[];
  filters: SearchSessionFilter[];
  activeIonLink: Link | undefined;
  imageBounds: Rectangle | undefined;
  searchArea: Rectangle | undefined;
  rectangleSearchForm: Form | undefined;
};

const { state, onChange } = createStore<ImageSearchStore>({
  token: undefined,
  image: undefined,
  resizedImageUrl: undefined,
  results: [],
  filters: [],
  activeIonLink: undefined,
  imageBounds: undefined,
  searchArea: undefined,
  rectangleSearchForm: undefined,
});

const updateState = (response: SearchSession) => {
  state.results = response.value;
  state.filters = readFilters(foldValueObject(response.filters));
  state.rectangleSearchForm = response.searchArea;

  detectObjects(response);
};

const makeLinkRequest = <T>(
  link: Link
): TE.TaskEither<NetworkError, ValueObject<T>> => {
  return pipe(
    composeAuth(state.token),
    TE.fromEither,
    TE.chain(linkRequest<T>(link))
  );
};

const detectObjects = async (data: SearchSession) => {
  const error: NetworkError = {
    errorType: "NetworkError",
    body: "Can not get a link for objects detection",
  };

  await pipe(
    getLink(data, "detectedObjects"),
    TE.fromOption(() => error),
    TE.chain(makeLinkRequest),
    TE.map((objects: ValueObject<ValueObject<DetectedObject>[]>) =>
      console.log(objects)
    )
  )();
};

onChange("image", async (newImage: File) => {
  const image = await fromFile(newImage);

  image.onload = async () => {
    const [url, rect] = resizeImage(RESIZED_IMAGE_WIDTH, image);
    const padding = 16;
    const { x, y } = move(rect, { x: padding, y: padding });
    const searchArea = {
      x,
      y,
      width: rect.width - padding * 2,
      height: rect.height - padding * 2,
    };

    state.searchArea = searchArea;
    state.resizedImageUrl = url;
    state.imageBounds = rect;

    const resizedImageFile = await toFile(state.resizedImageUrl);

    await pipe(
      composeSearchSessionData(state.token, resizedImageFile),
      TE.fromEither,
      TE.chain(searchSessionClient),
      TE.map(updateState)
    )();
  };
});

onChange(
  "activeIonLink",
  async (newLink: Link) =>
    await pipe(
      composeAuth(state.token),
      TE.fromEither,
      TE.chain(linkRequest(newLink)),
      TE.map(updateState)
    )()
);

export const makeRectangularSearchRequest = async () => {
  const scaled = divideOnSized(state.imageBounds)(state.searchArea);

  const searchRectangle = {
    width: scaled.width,
    height: scaled.height,
    left: scaled.x,
    top: scaled.y,
  };

  return await pipe(
    composeAuth(state.token),
    TE.fromEither,
    TE.chain(formRequest(state.rectangleSearchForm, searchRectangle)),
    TE.map(updateState)
  )();
};

export const imageSearchState = state;
