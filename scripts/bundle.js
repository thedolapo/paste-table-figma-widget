const esbuild = require("esbuild");
const path = require("path");

const root = path.join(__dirname, "..");

esbuild
  .build({
    entryPoints: [path.join(root, "widget-src", "code.tsx")],
    bundle: true,
    format: "iife",
    outfile: path.join(root, "code.js"),
    platform: "browser",
    target: "es2015",
    jsx: "transform",
    jsxFactory: "figma.widget.h",
    jsxFragment: "figma.widget.Fragment",
    loader: { ".ts": "ts", ".tsx": "tsx" },
    minify: true,
    sourcemap: false,
    define: { "process.env.NODE_ENV": '"production"' },
  })
  .then(() => {})
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
