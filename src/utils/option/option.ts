import { sequenceT } from "fp-ts/lib/Apply";
import { Apply, some, none, Option } from "fp-ts/lib/Option";

export const sequenceToOption = sequenceT(Apply);

export const checkEmpryString = (x: string): Option<string> =>
  x.length > 0 ? some(x) : none;
