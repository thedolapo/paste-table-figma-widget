# Paste Table

A Figma widget that converts pasted table data (HTML, Markdown, TSV, CSV, or plain text) into a live, editable table on the canvas.

## Build

```bash
npm install
npm run build
```

Output: `code.js` (and inlined UI in the bundle). Use with `manifest.json` and `ui.html` in Figma (Widgets / Development / Import plugin from manifest).

## Test

```bash
npm test
```

## Loading in Figma

The plugin is loaded via `manifest.json` and the built `code.js`. Do not commit secrets: **FIGMA_ACCESS_TOKEN** is only for the optional dev script `scripts/fetch-figma-reference.js`. Set it in your environment when running that script; never commit it.
