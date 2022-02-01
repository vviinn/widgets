export const listValues = (e) => Object.values(e)
  .filter((val) => typeof val === "string")
  .map((c) => c);
