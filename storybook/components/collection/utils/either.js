import { sequenceT } from "fp-ts/lib/Apply";
import { Apply } from "fp-ts/lib/Either";
export const sequenceToEither = sequenceT(Apply);
