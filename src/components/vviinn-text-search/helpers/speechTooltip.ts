import { browserType } from "./browserType";

export const speechTooltip = () => {
  const { isSafari } = browserType();
  if (isSafari) return "Please enable Siri";
  return "Please enable microphone";
};
