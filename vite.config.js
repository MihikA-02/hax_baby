import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";

// Detect Vercel environment automatically
const isVercel = !!process.env.VERCEL;

export default defineConfig(({ command }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  resolve: {
    tsconfigPaths: true,
    alias: {
      "@": "/src",
    },
    dedupe: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "@tanstack/react-query",
      "@tanstack/query-core",
    ],
  },
  plugins: [
    tailwindcss(),
    tanstackStart({
      server: { entry: "server.js" },
      router: {
        routesDirectory: "./src/routes",
        disableTypes: true,
        generatedRouteTree: "./src/routeTree.gen.js",
      },
    }),
    command === "build"
      ? nitro({ preset: isVercel ? "vercel" : "node-server" })
      : null,
    viteReact(),
  ].filter(Boolean),
}));
