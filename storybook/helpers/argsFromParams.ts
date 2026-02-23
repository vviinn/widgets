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

const decodeParam = (s: string) =>
  decodeURIComponent(s.replace(/\+/g, " "));

const splitEntry = (item: string): [string, string] => {
  const colonIndex = item.indexOf(":");
  if (colonIndex === -1) return [decodeParam(item), ""];
  return [
    decodeParam(item.substring(0, colonIndex)),
    decodeParam(item.substring(colonIndex + 1)),
  ];
};

const parseArgs = (urlArgs: string) =>
  Object.fromEntries(urlArgs.split(";").map(splitEntry));

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
  return parseArgs(argsString);
};

export const argsFromParams = (args: any) => {
  const isNewTab = !document.referrer.length;
  const url = isNewTab ? window.location.href : document.referrer;
  if (url) {
    const argsStart = url.indexOf("args=");
    if (argsStart >= 0) {
      const urlArgs = url.substring(argsStart + 5);
      const entries = isNewTab ? hrefArgs(urlArgs) : parseArgs(urlArgs);
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
