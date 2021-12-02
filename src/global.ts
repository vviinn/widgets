import * as Sentry from "@sentry/browser";
import { Env } from "@stencil/core";

const setupSentry = () => {
  Sentry.init({
    dsn: "https://70bcf561598b44148bd3cabc7c142a6c@o1015876.ingest.sentry.io/5983034",
    release: `${Env.packageName}@${Env.packageVersion}`,
    environment: Env.environment,
    tracesSampleRate: 1.0,
    maxBreadcrumbs: 4,
    integrations: (integrations) => {
      console.log("Integrations:", integrations);
      return integrations;
    },
    tracesSampler: (samplingContext) => {
      console.log("samplingContext", samplingContext);
      return 1.0;
    },
    beforeSend(event) {
      console.log("event", event);
      return event;
    },
  });
};

export default function() {
  setupSentry();
}
