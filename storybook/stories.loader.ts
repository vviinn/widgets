export default function storyLoader(source) {
  let processed = source;

  const envVars = Object.fromEntries(
    Object.entries(process.env).filter(([key]) => key.startsWith('STORYBOOK_'))
  );

  for (let key in envVars) {
    if (envVars[key]) {
      processed = processed.replaceAll(key, envVars[key]);
    }
  }

  return processed;
}
