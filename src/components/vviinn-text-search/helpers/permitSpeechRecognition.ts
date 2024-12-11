import { browserType } from "./browserType";

export const permitSpeechRecognition = () => {
  const uncastedWindow = window as any;
  const speechRecognition =
    uncastedWindow.webkitSpeechRecognition || uncastedWindow.SpeechRecognition;

  if (!speechRecognition) return;

  const { forbiddenBrowser, isChrome, isSafari } = browserType();
  if (forbiddenBrowser) return;
  if (isChrome || isSafari) {
    return speechRecognition;
  }
  return;
};
