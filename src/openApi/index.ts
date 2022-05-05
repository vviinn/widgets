import {
  AuthMethodsConfiguration,
  createConfiguration,
  DefaultApi,
  HttpBearerConfiguration,
  servers,
  TokenProvider,
} from "vviinn-tracking-client-ts";
import { ConfigurationParameters } from "vviinn-tracking-client-ts/dist/configuration";

const STAGE_SERVER_IDENTIFIER = "stage";

export const getTrackingServerByApiPath = (apiPath: string) =>
  isProductionPath(apiPath) ? servers[0] : servers[1];

export const isProductionPath = (apiPath: string): boolean =>
  !apiPath.includes(STAGE_SERVER_IDENTIFIER);

// TODO find way to utilize this function when we will use several openApi clients
export const createBearerAuth = (
  token: string | PromiseLike<string>
): AuthMethodsConfiguration => {
  const provider: TokenProvider = {
    getToken: () => {
      return new Promise((resolve) => resolve(token));
    },
  };

  const bearerConf: HttpBearerConfiguration = {
    tokenProvider: provider,
  };

  return {
    bearerAuth: bearerConf,
  };
};

export const createTrackingApi = (
  apiPath: string,
  token: string | PromiseLike<string>
) => {
  const baseServer = getTrackingServerByApiPath(apiPath);
  const authMethods = createBearerAuth(token);

  const configuration: ConfigurationParameters = {
    baseServer,
    authMethods,
  };

  return new DefaultApi(createConfiguration(configuration));
};
