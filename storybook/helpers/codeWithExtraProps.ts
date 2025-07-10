export const codeWithExtraProps = (code: string, extraProps?: string) => {
  if (!extraProps) return code;
  const currentPropsEnd = code.indexOf(">");
  return `${code.slice(0, currentPropsEnd)}${extraProps}\n${code.slice(currentPropsEnd)}`;
};
