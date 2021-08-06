import { createStore } from "@stencil/store";
import * as O from "fp-ts/lib/Option";
import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import { Recommendation } from "../recommendation/recommendation";
import {
  readFilters,
  SearchSession,
  //searchSessionClient,
  SearchSessionFilter,
  DetectedObject,
  searchSessionClient,
  //makeRequestFromFile,
} from "../searchSession/searchSession";
import { foldValueObject, ValueObject } from "../network/ion/ValueObject";
import { Link, linkRequest, getLink } from "../network/ion/Link";
import { divideOnSized, Rectangle } from "../geometry/Rectangle";
import { Form, formRequest } from "../network/ion/Form";
import * as F from "../network/ion/File";
import { Handler, fromRectangle } from "../cropper/Handler";
import { sequenceToOption } from "../utils/option/option";
import { processBearerToken } from "../utils/token/tokenUtils";
import { BasicError } from "../error";
import { sequenceToEither } from "../utils/either";
import { imageFormFromFile } from "../Image/form";

const RESIZED_IMAGE_WIDTH = 300;
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

type ImageSearchStore = {
  token: string | undefined;
  results: Recommendation[];
  filters: SearchSessionFilter[];
  activeIonLink: Link | undefined;
  cropperHandlers: Handler[];
  rectangleSearchForm: Form | undefined;
  detectedObjects: ValueObject<DetectedObject>[];
  detectedObject: ValueObject<DetectedObject> | undefined;

  imageWidth: number;

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

  imageWidth: RESIZED_IMAGE_WIDTH,

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
): TE.TaskEither<BasicError<Response | string>, ValueObject<T>> => {
  return pipe(
    makeAuthorizedRequest(state.token),
    TE.fromEither,
    TE.chainW(linkRequest<T>(link))
  );
};

const detectObjects = async (data: SearchSession) => {
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
};

const uploadHiresFile = async (sessionResponse: SearchSession, file: File) => {
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

onChange(
  "activeIonLink",
  async (newLink: Link) =>
    await pipe(
      makeAuthorizedRequest(state.token),
      TE.fromEither,
      TE.chainW(linkRequest(newLink)),
      TE.map(updateState),
      TE.mapLeft((error) => {
        return {
          kind: "network error",
          inner: error,
        };
      })
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
  const fileForm = imageFormFromFile(file);

  const tokenWithFile = sequenceToEither(
    processBearerToken(state.token),
    E.right(fileForm)
  );

  return pipe(
    tokenWithFile,
    E.map(
      ([headers, body]): RequestInit => {
        return {
          headers,
          body,
        };
      }
    ),
    TE.fromEither,
    TE.chain(searchSessionClient),
    TE.map((sessionResponse) => {
      updateState(sessionResponse);
      detectObjects(sessionResponse);
      uploadHiresFile(sessionResponse, file);

      return sessionResponse;
    })
  );
};

export const imageSearchState = state;
