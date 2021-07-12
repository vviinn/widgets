import { createStore } from "@stencil/store";
import * as O from "fp-ts/lib/Option";
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
import { divideOnSized, Rectangle } from "../geometry/Rectangle";
import { Form, formRequest } from "../network/ion/Form";
import * as F from "../network/ion/File";
import { fromFile } from "../Image/fromFile";
import { resizeImage } from "../Image/resizeImage";
import { toFile } from "../Image/toFile";
import { Handler, fromRectangle } from "../cropper/Handler";
import { sequenceToOption } from "../utils/option/option";

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
  results: Recommendation[];
  filters: SearchSessionFilter[];
  activeIonLink: Link | undefined;
  cropperHandlers: Handler[];
  rectangleSearchForm: Form | undefined;
  detectedObjects: ValueObject<DetectedObject>[];
  detectedObject: ValueObject<DetectedObject> | undefined;

  image: O.Option<HTMLImageElement>;
  imageUrl: O.Option<string>;
  imageBounds: O.Option<Rectangle>;
  searchArea: O.Option<Rectangle>;

  resultsComponents: HTMLElement[];
};

const { state, onChange } = createStore<ImageSearchStore>({
  token: undefined,
  results: [],
  filters: [],
  activeIonLink: undefined,
  cropperHandlers: [],
  rectangleSearchForm: undefined,
  detectedObjects: [],
  detectedObject: undefined,

  image: O.none,
  imageUrl: O.none,
  imageBounds: O.none,
  searchArea: O.none,

  resultsComponents: [],
});

const updateState = async (response: SearchSession) => {
  state.results = response.value;
  state.filters = readFilters(foldValueObject(response.filters));
  state.rectangleSearchForm = response.searchArea;
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
    TE.map(
      (objects: ValueObject<ValueObject<DetectedObject>[]>) =>
        (state.detectedObjects = foldValueObject(objects))
    )
  )();
};

const uploadHiresFile = async (sessionResponse: SearchSession, file: File) => {
  const ionFile: F.IonFile = await F.fromFile(file);
  const formPayload = {
    image: ionFile,
  };

  const form = sessionResponse.uploadHighResolutionImage;

  await pipe(
    composeAuth(state.token),
    TE.fromEither,
    TE.chain(formRequest<void>(form, formPayload))
  )();
};

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

onChange("searchArea", (newSearchArea: O.Option<Rectangle>) => {
  pipe(
    newSearchArea,
    O.map((area) => {
      state.cropperHandlers = fromRectangle(area);
    })
  );
});

export const makeRectangularSearchRequest = async () => {
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
        composeAuth(state.token),
        TE.fromEither,
        TE.chain(formRequest(state.rectangleSearchForm, searchRectangle)),
        TE.map(updateState)
      )();
    })
  );
};

export const uploadFile = async (file: File) => {
  const image = await fromFile(file);

  image.onload = async () => {
    const [url] = resizeImage(RESIZED_IMAGE_WIDTH, image);
    const resizedImageFile = await toFile(url);

    state.image = O.some(image);
    state.imageUrl = O.some(image.src);

    await pipe(
      composeSearchSessionData(state.token, resizedImageFile),
      TE.fromEither,
      TE.chain(searchSessionClient),
      TE.map((sessionResponse) => {
        updateState(sessionResponse);
        detectObjects(sessionResponse);
        uploadHiresFile(sessionResponse, file);
      })
    )();
  };
};

export const imageSearchState = state;
