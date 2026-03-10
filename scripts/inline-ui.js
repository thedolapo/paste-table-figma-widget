const fs = require("fs");
const path = require("path");
const html = fs.readFileSync(path.join(__dirname, "..", "ui.html"), "utf8");
const escaped = html
  .replace(/\\/g, "\\\\")
  .replace(/`/g, "\\`")
  .replace(/\$/g, "\\$");
const out = `/** Generated from ui.html - do not edit */\nexport const UI_HTML = ` + "`" + escaped + "`;\n";
fs.writeFileSync(path.join(__dirname, "..", "src", "ui-html.generated.ts"), out);
