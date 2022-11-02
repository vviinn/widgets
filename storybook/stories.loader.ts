export default function storyLoader(source) {
  let processed = source;

  for (let key in process.env) {
    if (key.includes("STORYBOOK")) {
      processed = processed.replaceAll(key, process.env[key]);
    }
  }

  return processed;
}
