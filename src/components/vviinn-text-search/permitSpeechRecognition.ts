export const permitSpeechRecognition = () => {
  const uncastedWindow = window as any;
  const speechRecognition =
    uncastedWindow.SpeechRecognition || uncastedWindow.webkitSpeechRecognition;
  if (!speechRecognition) return;

  const winNav = window.navigator as any;
  const vendorName = winNav.vendor;
  const forbiddenBrowserRules = [
    typeof uncastedWindow.opr !== "undefined",
    winNav.userAgent.indexOf("Firefox") > -1,
    winNav.userAgent.indexOf("Edg") > -1,
  ];
  if (forbiddenBrowserRules.some((rule) => rule === true)) return;
  const permittedBrowserRules = [
    typeof winNav.userAgentData !== "undefined"
      ? winNav.userAgentData.brands[0].brand === "Google Chrome"
      : vendorName === "Google Inc.",
  ];
  if (permittedBrowserRules.some((rule) => rule === true)) {
    return speechRecognition;
  }
  return;
};
