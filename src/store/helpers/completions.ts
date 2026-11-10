import type { QueryCompletion } from "../../interfaces";
import { isSafeLink } from "../../helpers/url/isSafeLink";

/** The completions with every link `isSafeLink` rejects removed, so whoever reads them needn't check. */
export const withSafeLinks = (
  completions: QueryCompletion[],
): QueryCompletion[] =>
  completions.map((completion) =>
    isSafeLink(completion.url) ? completion : { ...completion, url: null },
  );
