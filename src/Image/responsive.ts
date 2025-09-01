/**
 * Get responsive image styles based on screen size
 */
export const getResponsiveImageStyles = (
  width: number,
  height: number,
  isSmallMobile: boolean = false,
) => {
  if (isSmallMobile) {
    return {
      width: "100%",
      height: "auto",
      maxHeight: "70vh",
      objectFit: "contain" as const,
    };
  }
  return {
    width: `${width}px`,
    height: `${height}px`,
  };
};
