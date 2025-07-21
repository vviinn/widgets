export const codeWithExtraProps = (code: string, extraProps: string) => {
  const currentPropsEnd = code.indexOf(">");
  const separateAt = code.slice(0, currentPropsEnd).trimEnd().length + 1;
  return `${code.slice(0, separateAt)}${extraProps}\n${code.slice(separateAt)}`;
};
