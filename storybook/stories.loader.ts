export default function storyLoader(source) {
  let processed = source;

  const envVars = Object.fromEntries(
    Object.entries(process.env).filter(([key]) => key.startsWith('STORYBOOK_'))
  );

  Object.entries(envVars).forEach(([key, value]) => {
    if (value) {
      processed = processed.replaceAll(key, value);
    }
  });

  return processed;
}
