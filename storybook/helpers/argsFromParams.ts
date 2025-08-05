const typecastValue = (
  initValue: string | boolean | number | null | undefined,
  paramsValue: string,
) => {
  switch (typeof initValue) {
    case "number": {
      const intValue = parseInt(paramsValue);
      return isNaN(intValue) ? paramsValue : intValue;
    }
    case "boolean":
      return paramsValue === "!true"; //storybook marks ! the supported special values, which are booleans, undefined and null
    default:
      return paramsValue === "!undefined"
        ? undefined
        : paramsValue === "!null"
          ? null
          : paramsValue;
  }
};

function updateInternalProperty(
  previousChild: any,
  keysArray: string[],
  newValue: string,
) {
  let currentChild = previousChild[keysArray[0]];
  let newChildValue;
  if (keysArray.length === 1)
    newChildValue = typecastValue(currentChild, newValue);
  else {
    if (currentChild === undefined) currentChild = {};
    const childKeys = keysArray.slice(1);
    newChildValue = updateInternalProperty(currentChild, childKeys, newValue);
  }
  return { ...previousChild, [keysArray[0]]: newChildValue };
}

const referrerArgs = (urlArgs: string) =>
  Object.fromEntries(urlArgs.split(";").map((item) => item.split(":")));

const meaningfulUrlPart = (urlArgs: string) => {
  const idIndex = urlArgs.lastIndexOf("&id=");
  const globalsIndex = urlArgs.lastIndexOf("&globals");
  const splitAt =
    idIndex >= 0
      ? globalsIndex >= 0
        ? Math.min(idIndex, globalsIndex)
        : idIndex
      : globalsIndex >= 0
        ? globalsIndex
        : urlArgs.length;
  return splitAt < urlArgs.length ? urlArgs.substring(0, splitAt) : urlArgs;
};

const hrefArgs = (urlArgs: string) => {
  const argsString = meaningfulUrlPart(urlArgs);
  if (!argsString.length) return;
  const unorderedEntries = argsString
    .split("%")
    .map((item, index) => (index !== 0 ? item.substring(2) : item));
  const orderedEntries: [string, string][] = [];
  for (let i = 0; i < unorderedEntries.length; i += 2) {
    if (unorderedEntries?.[i] && unorderedEntries?.[i + 1])
      orderedEntries.push([unorderedEntries[i], unorderedEntries[i + 1]]);
  }
  return Object.fromEntries(orderedEntries);
};

export const argsFromParams = (args: any) => {
  const isNewTab = !document.referrer.length;
  const url = isNewTab ? window.location.href : document.referrer;
  if (url) {
    const argsStart = url.indexOf("args=");
    if (argsStart >= 0) {
      const urlArgs = url.substring(argsStart + 5);
      const entries = isNewTab ? hrefArgs(urlArgs) : referrerArgs(urlArgs);
      if (entries) {
        for (const entry in entries) {
          if (entry.includes(".")) {
            const entryActualKeys = entry.split(".");
            args = updateInternalProperty(
              args,
              entryActualKeys,
              entries[entry],
            );
          } else args[entry] = typecastValue(args[entry], entries[entry]);
        }
      }
    }
  }
  return args;
};
