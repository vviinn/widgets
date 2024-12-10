import { browserType } from "./browserType";

export const permitSpeechRecognition = () => {
  const uncastedWindow = window as any;
  const speechRecognition =
    uncastedWindow.SpeechRecognition || uncastedWindow.webkitSpeechRecognition;
  if (!speechRecognition) return;

  const { forbiddenBrowser, isChrome, isSafari } = browserType();
  if (forbiddenBrowser) return;
  if (isChrome || isSafari) {
    return speechRecognition;
  }
  return;
};
