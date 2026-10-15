// Substitutions are supplied by .storybook/main.js rather than read from the environment
// here, so a single allowlist decides what can reach the documentation output.
export default function storyLoader(source, substitutions = {}) {
  let processed = source;

  Object.entries(substitutions).forEach(([key, value]) => {
    if (value) {
      processed = processed.replaceAll(key, value);
    }
  });

  return processed;
}
