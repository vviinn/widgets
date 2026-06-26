/** Returns the first file from a drop's DataTransfer (no type validation). */
export const parseDroppedFile = (
  dataTransfer: DataTransfer | null,
): File | null => dataTransfer?.files?.[0] ?? null;
