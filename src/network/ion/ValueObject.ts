import { Link } from "./Link";

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

export type Valueable<T> = {
  readonly value: T;
};

type Linked = {
  readonly links: {
    [link: string]: Link;
  };
};

export type ValueObject<T> = Valueable<T> &
  Partial<MemberObject> &
  Partial<Linked>;

export const foldValueObject = <T>(i: ValueObject<T>): T => {
  switch (i.type) {
    case "array": {
      return (i.value as any).map(foldValueObject);
    }
    default: {
      return i.value;
    }
  }
};
