import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";
import { Valueable } from "./ValueObject";
import { Link } from "./Link";
import { ValueObject } from "./ValueObject";
import { BasicError } from "../../error";
declare type FormRelation = "form" | "edit-form" | "create-form" | "query-form";
declare enum FormMemberName {
  desc = "desc",
  eform = "eform",
  enabled = "enabled",
  etype = "etype",
  form = "form",
  label = "label",
  max = "max",
  maxlength = "maxlength",
  maxsize = "maxsize",
  min = "min",
  minlength = "minlength",
  minsize = "minsize",
  mutable = "mutable",
  name = "name",
  options = "options",
  pattern = "pattern",
  placeholder = "placeholder",
  required = "required",
  secret = "secret",
  type = "type",
  value = "value",
  visible = "visible"
}
declare type FormMemberObject = {
  [key in FormMemberName]: unknown;
};
declare type FormField = Partial<FormMemberObject>;
export declare const checkFormFields: (f: FormField[], data: Object) => E.Either<string, Object>;
export declare type FormType = {
  rel: FormRelation[];
};
export declare type Form = Valueable<FormField[]> & Link & FormType;
export declare const requestFromForm: (form: Form, data: Object) => E.Either<string, [string, RequestInit]>;
export declare const formRequest: <T>(form: Form, data?: Object) => (payload: RequestInit) => TE.TaskEither<BasicError<Response> | BasicError<string>, ValueObject<T>>;
export {};
