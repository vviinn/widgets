import { isBrowser } from "./isBrowser";

export const speechTooltip = () => {
  const { isSafari } = isBrowser();
  if (isSafari) return "Please enable Siri \nto use speech recognition";
  return "Please enable microphone \nto use speech recognition";
};
