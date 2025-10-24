// Detects specific browser brands for feature support (e.g., Speech Recognition API)
// Returns browser identification for Chrome, Safari, and forbidden browsers
export const browserType = () => {
  const uncastedWindow = window as any;
  const winNav = window.navigator as any;
  const vendorName = winNav.vendor;
  const forbiddenBrowserRules = [
    typeof uncastedWindow.opr !== "undefined",
    winNav.userAgent.indexOf("Firefox") > -1,
    winNav.userAgent.indexOf("Edg") > -1,
  ];
  const forbiddenBrowser = forbiddenBrowserRules.some((rule) => rule === true);
  const isChrome =
    typeof winNav.userAgentData !== "undefined"
      ? winNav.userAgentData.brands[0]?.brand === "Google Chrome"
      : vendorName === "Google Inc.";
  const isSafari = winNav.userAgent.indexOf("Safari") > -1 && !isChrome;

  return { forbiddenBrowser, isChrome, isSafari };
};
