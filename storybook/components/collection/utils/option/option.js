import { sequenceT } from "fp-ts/lib/Apply";
import { Apply, some, none } from "fp-ts/lib/Option";
export const sequenceToOption = sequenceT(Apply);
export const checkEmpryString = (x) => x.length > 0 ? some(x) : none;
