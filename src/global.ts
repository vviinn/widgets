import * as Sentry from "@sentry/browser";
import { Env } from "@stencil/core";
import { filterInternalExeptions } from "./sentry";

const setupSentry = () => {
  Sentry.init({
    dsn: "https://70bcf561598b44148bd3cabc7c142a6c@o1015876.ingest.sentry.io/5983034",
    release: `${Env.packageName}@${Env.packageVersion}`,
    environment: Env.environment,
    tracesSampleRate: 0.0,
    maxBreadcrumbs: 4,
    beforeSend: filterInternalExeptions,
    allowUrls: [
      /https?:\/\/cdn\.jsdelivr\.net\/npm\/vviinn-widgets.+/
    ]
  });
};

export default function () {
  setupSentry();
}
