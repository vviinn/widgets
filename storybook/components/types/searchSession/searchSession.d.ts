import { ValueObject } from "../network/ion/ValueObject";
import { Link } from "../network/ion/Link";
import { Form } from "../network/ion/Form";
import { Recommendation } from "../recommendation/recommendation";
import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";
import { RectangleAlt } from "../geometry/RectangleAlt";
import { Eq } from "fp-ts/lib/Eq";
import { BasicError } from "../error";
export interface SearchSessionFilters {
  readonly [key: string]: Link[];
}
export interface SearchSessionFilter {
  name: string;
  filters: Link[];
}
export declare const readFilters: (filters: SearchSessionFilters) => SearchSessionFilter[];
declare type HasFilters = {
  readonly filters: ValueObject<SearchSessionFilters>;
};
export declare type DetectedObject = {
  class: string;
  score: number;
  rectangle: RectangleAlt;
};
export declare const detectedObjectEq: Eq<DetectedObject>;
declare type ContainsDetectedObjects = {
  readonly detectedObjects: ValueObject<DetectedObject>[];
};
declare type ContainsRectangleSearch = {
  readonly searchArea: Form;
};
declare type ContainsHiresImageUpload = {
  readonly uploadHighResolutionImage: Form;
};
export declare type SearchSession = ValueObject<Recommendation[]> & HasFilters & Partial<ContainsDetectedObjects> & ContainsRectangleSearch & ContainsHiresImageUpload;
export declare const searchSessionClient: (initialData: RequestInit) => TE.TaskEither<BasicError<Response | string>, SearchSession>;
export declare type ObjectsDetectedEvent = CustomEvent<ValueObject<DetectedObject>[]>;
export declare const makeRequestFromFile: (token: string, file: File) => E.Either<BasicError<string>, RequestInit>;
export {};
