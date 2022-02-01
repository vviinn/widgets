import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/lib/function";
import { getApiPath } from "../utils";
import { makeRequest } from "../request";
import { sequenceToEither } from "../../utils/either";
var FormMemberName;
(function (FormMemberName) {
  FormMemberName["desc"] = "desc";
  FormMemberName["eform"] = "eform";
  FormMemberName["enabled"] = "enabled";
  FormMemberName["etype"] = "etype";
  FormMemberName["form"] = "form";
  FormMemberName["label"] = "label";
  FormMemberName["max"] = "max";
  FormMemberName["maxlength"] = "maxlength";
  FormMemberName["maxsize"] = "maxsize";
  FormMemberName["min"] = "min";
  FormMemberName["minlength"] = "minlength";
  FormMemberName["minsize"] = "minsize";
  FormMemberName["mutable"] = "mutable";
  FormMemberName["name"] = "name";
  FormMemberName["options"] = "options";
  FormMemberName["pattern"] = "pattern";
  FormMemberName["placeholder"] = "placeholder";
  FormMemberName["required"] = "required";
  FormMemberName["secret"] = "secret";
  FormMemberName["type"] = "type";
  FormMemberName["value"] = "value";
  FormMemberName["visible"] = "visible";
})(FormMemberName || (FormMemberName = {}));
export const checkFormFields = (f, data) => {
  const fields = f.map((x) => x.name);
  const keys = Object.keys(data);
  const diff = fields.filter((x) => !keys.includes(x));
  return diff.length === 0
    ? E.right(data)
    : E.left(`Data should contains fields: ${diff.join(", ")}`);
};
export const requestFromForm = (form, data) => pipe(checkFormFields(form.value, data), E.map((checkedData) => form.rel.includes("query-form")
  ? transformGetForm(form, checkedData)
  : transformSendForm(form, checkedData)));
const transformGetForm = (form, data) => {
  const params = new URLSearchParams(Object.entries(data));
  const url = `${form.href}?${params.toString()}`;
  return [url, { method: "GET" }];
};
const transformSendForm = (form, data) => [
  form.href,
  {
    body: JSON.stringify(data),
    method: form.method,
    headers: new Headers({
      "Content-Type": "application/ion+json",
    }),
  },
];
export const formRequest = (form, data = {}) => (payload) => pipe(sequenceToEither(getApiPath(), pipe(requestFromForm(form, data), E.mapLeft((error) => {
  return { kind: "app", inner: error };
}))), TE.fromEither, TE.chainW((initialData) => {
  const apiPath = initialData[0];
  const [formUrl, initObject] = initialData[1];
  return makeRequest(formUrl, initObject)([apiPath, payload]);
}));
