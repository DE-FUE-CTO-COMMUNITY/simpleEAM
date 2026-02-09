import { defineConfig } from "vite";

export default defineConfig({
  server: {
    host: true,
    port: 5174,
    allowedHosts: ["dev-server.mf2.eu"]
  }
});
