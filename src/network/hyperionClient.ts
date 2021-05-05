import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/lib/function";

enum ObjectMemberName {
  eform = "eform",
  etype = "etype",
  form = "form",
  href = "href",
  method = "method",
  accepts = "accepts",
  produces = "produces",
  rel = "rel",
  type = "type",
  value = "value",
}

type MemberObject = {
  [key in ObjectMemberName]: unknown;
};

type Valueable<T> = {
  readonly value: T;
};

export type ValueObject<T> = Valueable<T> & Partial<MemberObject>;

export type Link = {
  href: string;
};

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

export type FormType = {
  rel: FormRelation[];
  form: FormField[];
};

export const checkFormFields = (
  f: FormField[],
  data: Object
): E.Either<string, Object> => {
  const feilds = f.map((x) => x.name).flat() as string[];
  const keys = Object.keys(data);
  const diff = feilds.filter((x) => !keys.includes(x));

  return diff.length === 0
    ? E.right(data)
    : E.left(`Data should contains feilds: ${diff.join(",")}`);
};

export type Form = Link & FormType;

export const requestFromForm = (
  form: Form,
  data: Object
): E.Either<string, [string, RequestInit]> =>
  pipe(
    checkFormFields(form.form, data),
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
