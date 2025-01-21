import { Locale } from "../../../locale";
import { permitSpeechRecognition } from "./permitSpeechRecognition";
import Timeout = NodeJS.Timeout;

export const initializeRecognition = (
  locale: Locale,
  onStart: () => void,
  onEnd: () => {},
  onRecognized: (speechResult: string) => void,
) => {
  const speechRecognition = permitSpeechRecognition();
  if (!speechRecognition) return;

  const recognition: SpeechRecognition = new speechRecognition();
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  recognition.continuous = false;
  recognition.lang = locale;

  let recognitionTimeout: Timeout;

  recognition.onstart = () => {
    onStart();
    recognitionTimeout = setTimeout(() => {
      {
        recognition.stop();
      }
    }, 10000);
  };

  recognition.onspeechend = () => {
    recognition.stop();
    onEnd();
    clearTimeout(recognitionTimeout);
  };

  recognition.onend = onEnd;

  recognition.onresult = (event) => {
    const speechResult = event.results[0][0].transcript;
    onRecognized(speechResult);
  };

  return recognition;
};
