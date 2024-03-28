import { pipe } from "fp-ts/lib/function";
import { BasicError } from "../error";
import * as E from "fp-ts/Either";
import { getApiPath } from "../network/utils";
import { Recommendation } from "../components";

export interface MultiSearchRequestBody {
  query: string;
  resultsCount: number;
  campaign: string;
  excluded?: {
    column: string;
    values: string[];
  }[];
}

export type TextSearchSession = {
  data: {
    products: Recommendation[];
  };
};

export const DEFAULT_RESULTS_COUNT = 12;

export async function callMultiSearchEndpoint(
  requestBody: MultiSearchRequestBody,
  token: string
): Promise<E.Either<BasicError<string>, TextSearchSession>> {
  const urlEither: E.Either<BasicError<string>, string> = getApiPath();

  return pipe(
    urlEither,
    E.fold(
      (error) => Promise.resolve(E.left(error)),
      async (url) => {
        try {
          const response = await fetch(`${url}multi-search`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(requestBody),
          });

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }

          const data: TextSearchSession = await response.json();
          return E.right(data);
        } catch (error) {
          console.error("Error calling /multi-search:", error);
          return E.left({
            kind: "server",
            inner: error instanceof Error ? error.message : String(error),
          });
        }
      }
    )
  );
}
