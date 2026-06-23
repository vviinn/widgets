/**
 * Reads a dropped image file out of a drop's DataTransfer (file dragged from the OS).
 *
 * URL-from-page drops (image dragged off a web page, where the src lives in the
 * dragged "text/html" fragment) are intentionally not handled yet — reintroduce
 * that branch together with the consumer that needs it (e.g. the universal searchbar).
 */
export const parseDroppedFile = (dataTransfer: DataTransfer): File | null =>
  dataTransfer.files?.[0] ?? null;
