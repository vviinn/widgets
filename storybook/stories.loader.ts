export default function storyLoader(source) {
  let processed = source;

  const envVars = {
    STORYBOOK_CDN_PATH: process.env.STORYBOOK_CDN_PATH,
    STORYBOOK_NPM_PACKAGE_NAME: process.env.STORYBOOK_NPM_PACKAGE_NAME,
    STORYBOOK_VPR_WIDGET_TAG: process.env.STORYBOOK_VPR_WIDGET_TAG,
    STORYBOOK_VPS_WIDGET_TAG: process.env.STORYBOOK_VPS_WIDGET_TAG,
    STORYBOOK_API_PATH: process.env.STORYBOOK_API_PATH,
  };

  for (let key in envVars) {
    if (envVars[key]) {
      processed = processed.replaceAll(key, envVars[key]);
    }
  }

  return processed;
}
