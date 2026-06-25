/** Reads an OS-dropped image file from a drop's DataTransfer. */
export const parseDroppedFile = (
  dataTransfer: DataTransfer | null,
): File | null => dataTransfer?.files?.[0] ?? null;
