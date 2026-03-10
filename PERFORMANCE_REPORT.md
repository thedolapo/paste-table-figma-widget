# Paste Table – Performance & Test Report

## Playwright tests

- **Scope:** Paste Table UI (`ui.html`) only. The Figma widget runs inside the Figma client and is not E2E testable with Playwright.
- **Run:** `npm run test`
- **Results (last run):**
  - **Paste and create table button:** UI loads and button is visible; load time asserted &lt; 5s.
  - **Footer:** “Created by Habib Ayoade” and “Buy Coffee” link with correct `href` (`https://buymeacoffee.com/ayoadehabib`), `target="_blank"`, and `rel="noopener noreferrer"`.
  - **Interactivity:** Textarea and button are focusable and usable; sample table text can be entered.

All three tests passed.

## Bundle and assets

| Asset     | Size (bytes) | Notes                          |
|----------|--------------|---------------------------------|
| `code.js`| 19,383       | Widget bundle (UI inlined)     |
| `ui.html`| 2,555        | Source paste UI (dev reference)|

- **Total widget payload:** Bundle is built with `minify: true` for smaller size and faster parse time.

## Performance notes

- **UI load:** Opening the paste UI in Figma is driven by the host; local file load in tests completed in under 5 seconds.
- **No console logging** in production paths; widget and UI code are cleaned for production.
- **Console violations and slow load:** Most violations (e.g. `visibilitychange` / `click` / `message` handler duration, forced reflow, clipboard/camera permissions policy) and slow widget load come from **Figma’s own app and iframe** (vendor-core, figma_app, and the plugin sandbox), not from the Paste Table widget. We cannot fix those. This widget keeps the bundle minimal (minified), defers heavy work (e.g. `loadAllPagesAsync` only when creating a table), and avoids blocking the main thread on first paint.

---

*Report generated after implementing single Paste and create button, footer, recall-import UX, log removal, and Playwright tests.*
