const typecastValue = (initValue, paramsValue) => {
  if (typeof initValue === "number") return parseInt(paramsValue);
  else if (typeof initValue === "boolean") return paramsValue === "!true";
  return paramsValue;
};

function updateRelevantChild(previousChild, keysArray: string[], newValue) {
  let currentChild = previousChild[keysArray[0]];
  let newChildValue;
  if (keysArray.length === 1)
    newChildValue = typecastValue(currentChild, newValue);
  else {
    if (currentChild === undefined) currentChild = {};
    const childKeys = keysArray.slice(1);
    newChildValue = updateRelevantChild(currentChild, childKeys, newValue);
  }
  return { ...previousChild, [keysArray[0]]: newChildValue };
}

export const argsFromParams = (args) => {
  const url = document.referrer;
  const argsStart = url.indexOf("&args=");
  if (argsStart >= 0) {
    const urlArgs = url.substring(argsStart + 6);
    const entries = Object.fromEntries(
      urlArgs.split(";").map((item) => item.split(":")),
    );
    for (const entry in entries) {
      if (entry.includes(".")) {
        const entryActualKeys = entry.split(".");
        args = updateRelevantChild(args, entryActualKeys, entries[entry]);
      } else args[entry] = typecastValue(args[entry], entries[entry]);
    }
  }
  return args;
};
