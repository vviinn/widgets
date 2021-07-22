import * as Sentry from "@sentry/browser";
import { Integrations } from "@sentry/tracing";

const setupSentry = () => {
  Sentry.init({
    dsn:
      "https://2e48bb2503b749daae7628504d02853a@o731435.ingest.sentry.io/5783489",
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 1.0,
    maxBreadcrumbs: 4,
  });
};

export default function() {
  setupSentry();
}
