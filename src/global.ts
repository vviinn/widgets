import * as Sentry from "@sentry/browser";
import { Integrations } from "@sentry/tracing";
import { Env } from "@stencil/core";

const setupSentry = () => {
  Sentry.init({
    dsn:
      "https://70bcf561598b44148bd3cabc7c142a6c@o1015876.ingest.sentry.io/5983034",
    integrations: [new Integrations.BrowserTracing()],
    release: `${Env.packageName}@${Env.packageVersion}`,
    tracesSampleRate: 1.0,
    maxBreadcrumbs: 4,
    allowUrls: [/https?:\/\/.+vviinn-widgets.+.js/],
  });
};

export default function() {
  setupSentry();
}
