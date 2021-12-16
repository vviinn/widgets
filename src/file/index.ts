import { BasicError } from "../error";

export const fileDoesntExistError: BasicError<string> = {
  kind: "app",
  inner: "File doesnt exist",
};
