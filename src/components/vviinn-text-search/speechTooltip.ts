import { isBrowser } from "./isBrowser";

export const speechTooltip = () => {
  const { isSafari } = isBrowser();
  if (isSafari) return "Please enable Siri";
  return "Please enable microphone";
};
