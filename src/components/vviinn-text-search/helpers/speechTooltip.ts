import { browserType } from "../../../helpers/device/browserType";

export const speechTooltip = () => {
  const { isSafari } = browserType();
  if (isSafari) return "speechRecognition.tooltip.siri";
  return "speechRecognition.tooltip.general";
};
