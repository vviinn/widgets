import { Recommendation } from "../recommendation/recommendation";
import { apiPost } from "../network/apiClient";
import { TaskEither } from "fp-ts/TaskEither";
import { NetworkError } from "../network/request";

interface searchSessionBody {
  value: Recommendation[];
}

export interface SearchSessionResponce {
  vps: searchSessionBody;
  searchId: string;
}

export const startSearchSession = (
  options: RequestInit
): TaskEither<NetworkError, SearchSessionResponce> => {
  const url = `search/session`;
  return apiPost<SearchSessionResponce>(url, options);
};
