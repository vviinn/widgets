import { Locale } from "../../locale";
import { permitSpeechRecognition } from "./permitSpeechRecognition";

export const initializeRecognition = (
  locale: Locale,
  onEnd: () => {},
  onRecognized: (speechResult: string) => void
) => {
  const speechRecognition = permitSpeechRecognition();
  if (!speechRecognition) return;

  const recognition: SpeechRecognition = new speechRecognition();
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  recognition.continuous = false;
  recognition.lang = locale;

  recognition.onstart = () => {
    setTimeout(() => {
      {
        recognition.stop();
      }
    }, 10000);
  };

  recognition.onspeechend = () => {
    recognition.stop();
    onEnd();
  };

  recognition.onend = onEnd;

  recognition.onresult = (event) => {
    const speechResult = event.results[0][0].transcript;
    onRecognized(speechResult);
  };

  return recognition;
};
