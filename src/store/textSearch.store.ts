import { createStore } from "@stencil/store";
import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";
import * as O from "fp-ts/Option";
import { pipe } from "fp-ts/function";

import {
  MultiSearchRequestBody,
  TextSearchSession,
  textSearchSessionClient,
} from "../searchSession/searchSession";
import { Recommendation } from "../components";

type TextSearchStore = {
  token?: string;
  campaignId: O.Option<string>;
  excluded?: string;
  results: Recommendation[];

  serverError: boolean;
  loading: boolean;
};

const { state } = createStore<TextSearchStore>({
  campaignId: O.none,
  excluded: "",
  results: [],
  serverError: false,
  loading: false,
});

export const textSearchState = state;

export const performTextSearch = (query: string) => {
  state.loading = true;

  return pipe(
    O.fromNullable(state.token),
    O.fold(
      () => TE.left(new Error("Token is missing")),
      (token) =>
        TE.tryCatch(
          () => {
            const requestBody: MultiSearchRequestBody = {
              query,
              campaign: O.getOrElse(() => "")(state.campaignId),
            };
            return textSearchSessionClient(requestBody, token);
          },
          (reason) => new Error(String(reason))
        )
    ),
    TE.fold(
      (error) => async () => {
        console.error("Error:", error);
        state.serverError = true;
        state.loading = false;
      },
      (result) => async () => {
        const products = E.fold(
          () => [],
          (session) => session
        )(result) as TextSearchSession;

        state.results = products.data.products;
        state.serverError = false;
        state.loading = false;
      }
    )
  )();
};
