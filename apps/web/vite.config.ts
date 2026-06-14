import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  plugins: [svelte()],
  server: {
    host: "127.0.0.1",
    port: 5174,
    strictPort: false,
  },
  preview: {
    host: "127.0.0.1",
    port: 4174,
    strictPort: false,
  },
});
