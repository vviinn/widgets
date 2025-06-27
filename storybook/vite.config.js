import { defineConfig } from "vite";

export default defineConfig({
  define: {
    "process.env": {},
    global: "globalThis",
  },
  optimizeDeps: {
    include: ["lit-html", "vviinn-widgets"],
  },
  build: {
    lib: {
      entry: "./src/index.ts",
      formats: ["es"],
    },
    rollupOptions: {
      external: ["lit-html"],
    },
  },
});
