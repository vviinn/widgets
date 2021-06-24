import { sequenceT } from "fp-ts/lib/Apply";
import { Apply } from "fp-ts/lib/Option";

export const sequenceToOption = sequenceT(Apply);
