const typecastValue = (
  initValue: string | boolean | number | null | undefined,
  paramsValue: string,
) => {
  switch (typeof initValue) {
    case "number":
      return parseInt(paramsValue);
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

const hrefArgs = (urlArgs: string) => {
  const argsString = urlArgs.split("&id=")[0];
  if (!argsString.length) return;
  const unorderedEntries = argsString
    .split("%")
    .map((item, index) => (index !== 0 ? item.substring(2) : item));
  const orderedEntries: [string, string][] = [];
  for (let i = 0; i < unorderedEntries.length; i += 2) {
    orderedEntries.push([unorderedEntries[i], unorderedEntries[i + 1]]);
  }
  return Object.fromEntries(orderedEntries);
};

export const argsFromParams = (args: any) => {
  const isNewTab = !document.referrer.length;
  const url = isNewTab ? window.location.href : document.referrer;
  if (url) {
    const argsStart = url.indexOf("&args=");
    if (argsStart >= 0) {
      const urlArgs = url.substring(argsStart + 6);
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
