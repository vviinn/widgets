import { isRight, isLeft } from "fp-ts/lib/Either";
import { Form, requestFromForm, checkFormFields } from "./Form";

it("should check data for form fields array", async () => {
  const form: Form = {
    href: "http://nowhere.com",
    rel: ["query-form"],
    value: [{ name: "foo" }, { name: "bar" }],
  };

  const data = {
    foo: "foo_data",
    bar: "bar_data",
  };

  const result = checkFormFields(form.value, data);

  expect(isRight(result)).toBe(true);
});

it("should fails if data not fit with form fields", async () => {
  const form: Form = {
    href: "http://nowhere.com",
    rel: ["query-form"],
    value: [{ name: "foo" }, { name: "bar" }],
  };

  const data = {
    foo: "foo_data",
  };

  const result = checkFormFields(form.value, data);

  expect(isLeft(result)).toBe(true);
});

it("should create proper url", async () => {
  const form: Form = {
    href: "http://nowhere.com",
    rel: ["query-form"],
    value: [{ name: "foo" }, { name: "bar" }],
  };

  const data = {
    foo: "foo_data",
    bar: "bar_data",
  };

  const result = requestFromForm(form, data);

  expect(result).toEqual({
    _tag: "Right",
    right: ["http://nowhere.com?foo=foo_data&bar=bar_data", { method: "GET" }],
  });
});
