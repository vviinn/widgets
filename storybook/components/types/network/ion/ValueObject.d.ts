import { Link } from "./Link";
declare enum ObjectMemberName {
  eform = "eform",
  etype = "etype",
  form = "form",
  href = "href",
  method = "method",
  accepts = "accepts",
  produces = "produces",
  rel = "rel",
  type = "type",
  value = "value"
}
declare type MemberObject = {
  [key in ObjectMemberName]: unknown;
};
export declare type Valueable<T> = {
  readonly value: T;
};
declare type Linked = {
  readonly links: {
    [link: string]: Link;
  };
};
export declare type ValueObject<T> = Valueable<T> & Partial<MemberObject> & Partial<Linked>;
export declare const foldValueObject: <T>(i: ValueObject<T>) => T;
export {};
