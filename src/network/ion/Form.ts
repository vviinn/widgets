import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/lib/function";
import { sequenceT } from "fp-ts/Apply";
import { Valueable } from "./ValueObject";
import { Link } from "./Link";
import { ValueObject } from "./ValueObject";
import { getApiPath } from "../utils";
import { makeRequest, networkErrorFrom } from "../request";

const sequenceToEither = sequenceT(E.either);

type FormRelation = "form" | "edit-form" | "create-form" | "query-form";

enum FormMemberName {
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
  visible = "visible",
}

type FormMemberObject = {
  [key in FormMemberName]: unknown;
};

type FormField = Partial<FormMemberObject>;

export const checkFormFields = (
  f: FormField[],
  data: Object
): E.Either<string, Object> => {
  const fields = f.map((x) => x.name) as string[];
  const keys = Object.keys(data);
  const diff = fields.filter((x) => !keys.includes(x));

  return diff.length === 0
    ? E.right(data)
    : E.left(`Data should contains fields: ${diff.join(", ")}`);
};

export type FormType = {
  rel: FormRelation[];
};

export type Form = Valueable<FormField[]> & Link & FormType;

export const requestFromForm = (
  form: Form,
  data: Object
): E.Either<string, [string, RequestInit]> =>
  pipe(
    checkFormFields(form.value, data),
    E.map((checkedData) =>
      form.rel.includes("query-form")
        ? transformGetForm(form, checkedData)
        : transformSendForm(form, checkedData)
    )
  );

const transformGetForm = (form: Form, data: Object): [string, RequestInit] => {
  const params = new URLSearchParams(Object.entries(data));
  const url = `${form.href}?${params.toString()}`;

  return [url, { method: "GET" }];
};

const transformSendForm = (form: Form, data: Object): [string, RequestInit] => {
  return [form.href, { body: JSON.stringify(data), method: "POST" }];
};

export const formRequest = <T>(form: Form, data: Object = {}) => (
  payload: RequestInit
) =>
  pipe(
    sequenceToEither(getApiPath(), requestFromForm(form, data)),
    TE.fromEither,
    TE.mapLeft(networkErrorFrom),
    TE.chain((initialData) => {
      const apiPath = initialData[0];
      const [formUrl, initObject] = initialData[1];
      return makeRequest<ValueObject<T>>(
        formUrl,
        initObject
      )([apiPath, payload]);
    })
  );
