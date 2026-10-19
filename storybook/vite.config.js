import { defineConfig } from "vite";

export default defineConfig({
  define: {
    "process.env": {},
    global: "globalThis",
  },
  optimizeDeps: {
    include: ["vviinn-widgets"],
  },
});
