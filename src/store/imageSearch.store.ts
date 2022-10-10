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
  searchSessionClient,
  SearchSessionStatus,
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
import { fromFile } from "../Image/fromFile";
import { fromEvent, Subject, Observable, map, concatMap, tap } from "rxjs";
import { resize } from "../Image/resizer.worker";
import { worker } from "../Image/resizer.worker.ts?worker";
import { prepareImageForResizing } from "../Image/resizeImage";
import { fromImageData } from "../Image";
import { toFile } from "../Image/toFile";

type ResizerWorkerMessage = [string, number, ImageData, any];

const RESIZED_IMAGE_WIDTH = 500;
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
  token?: string;
  campaignId: O.Option<string>;
  results: Recommendation[];
  filters: SearchSessionFilter[];
  resetCategoryLink?: Link;
  activeIonLink?: Link;
  cropperHandlers: Handler[];
  selectedCropper?: number;
  rectangleSearchForm?: Form;
  detectedObjects: ValueObject<DetectedObject>[];
  detectedObject?: ValueObject<DetectedObject>;
  objectDetectionInProgress: boolean;
  imageWidth: number;

  image: O.Option<HTMLImageElement>;
  imageUrl: O.Option<string>;
  imageBounds: O.Option<Rectangle>;
  searchArea: O.Option<Rectangle>;

  resultsComponents: HTMLElement[];

  serverError: boolean;
  loading: boolean;

  imageSelectedObserver: Subject<File>;
  imageResizerObserver: Observable<MessageEvent<ResizerWorkerMessage>>;
  searchSessionObserver: Subject<string>;
  objectDetectionObserver: Subject<string>;

  kek: boolean;
  status: SearchSessionStatus;
};

const { state, onChange } = createStore<ImageSearchStore>({
  campaignId: O.none,
  results: [],
  filters: [],
  cropperHandlers: [],
  detectedObjects: [],
  objectDetectionInProgress: false,

  imageWidth: RESIZED_IMAGE_WIDTH,

  image: O.none,
  imageUrl: O.none,
  imageBounds: O.none,
  searchArea: O.none,

  resultsComponents: [],

  serverError: false,
  loading: false,
  imageSelectedObserver: new Subject(),
  imageResizerObserver: fromEvent<MessageEvent<ResizerWorkerMessage>>(
    worker,
    "message"
  ),
  searchSessionObserver: new Subject(),
  objectDetectionObserver: new Subject(),

  kek: false,
  status: "idle",
});

const prepareToResize = prepareImageForResizing(state.imageWidth);

const updateState = async (response: SearchSession) => {
  state.results = response.value;
  state.filters = readFilters(foldValueObject(response.filters));
  state.rectangleSearchForm = response.searchArea;
  state.resetCategoryLink = response.links?.clearFilters;
  state.loading = false;
  state.status = "fullfield";
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

export const uploadHiresFile = async (
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
  state.loading = true;
  state.status = "pending";

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
    TE.chain((request) => searchSessionClient(request, state.campaignId)),
    TE.map((sessionResponse) => {
      updateState(sessionResponse);
      detectObjects(sessionResponse);
      return sessionResponse;
    }),
    TE.mapLeft((error) => {
      state.serverError = true;
      state.loading = false;
      state.status = "error";
      return error;
    })
  );
};

export const imageSearchState = state;
export const imageSearcStateListener = onChange;

onChange("activeIonLink", async (newLink: Link) => {
  state.loading = true;
  state.status = "pending";

  const link = newLink ? newLink : state.resetCategoryLink;

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

onChange("searchArea", (newSearchArea: O.Option<Rectangle>) => {
  pipe(
    newSearchArea,
    O.map((area) => {
      state.cropperHandlers = fromRectangle(area);
    })
  );
});

onChange("serverError", () => {
  state.loading = false;
  state.status = "error";
});

onChange("kek", () => {
  console.log("kek changed in store");
});

const setSelectedImage = (image: HTMLImageElement) => {
  imageSearchState.image = O.some(image);
  imageSearchState.imageUrl = O.some(image.src);
};

state.imageSelectedObserver
  .pipe(
    tap(() => (state.status = "imageSelected")),
    concatMap(fromFile),
    map(prepareToResize)
  )
  .subscribe((prepearedImageData) => {
    // to not copy data use direct api with postMessage
    resize(prepearedImageData);
  });

const imageResizeStream = state.imageResizerObserver.pipe(
  map((event) => event.data[2]),
  map(fromImageData),
  map((canvas) => canvas.toDataURL()),
  concatMap(toFile),
  tap(() => (state.status = "imageProcessed"))
);

imageResizeStream.subscribe((f) => {
  uploadFile(f)();
});

imageResizeStream.pipe(concatMap(fromFile)).subscribe(setSelectedImage);
