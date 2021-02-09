interface Enum {
  [id: number]: string;
}

export const listValues = <T>(e: Enum): T[] =>
  Object.values(e)
    .filter((val) => typeof val === "string")
    .map((c) => c as T);
