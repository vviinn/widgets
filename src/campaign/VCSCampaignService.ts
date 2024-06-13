import { apiPost } from "../network/apiClient";
import { Interfaces } from "../interfaces/recommendation";

type CrossSellingRequest = Interfaces["CrossSellingRequest"];
type CrossSellingResponse = Interfaces["CrossSellingResponse"];

export const getVCSRecommendations =
  (body: CrossSellingRequest) => (options: RequestInit) => {
    const url = "cross-selling";

    return apiPost<CrossSellingResponse>(url, {
      ...options,
      body: JSON.stringify(body),
    });
  };
