require("esbuild").build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  outfile: "dist/bundle.js",
  platform: "browser",
  sourcemap: true,
  target: ["es2018"],
}).catch(() => process.exit(1));