import type { TableData } from "../types";
import type { TableFormat } from "./detect";
import { detectTableFormat } from "./detect";
import { parseHtmlTable } from "./html";
import { parseMarkdownTable } from "./markdown";
import { parseTsv } from "./tsv";
import { parseCsv } from "./csv";
import { parsePlainTextTable } from "./plainText";

export type ParseResult =
  | { ok: true; data: TableData }
  | { ok: false; reason: string };

/**
 * Detect format and parse input into TableData.
 */
export function parseTableInput(input: string): ParseResult {
  const trimmed = input.trim();
  if (!trimmed) {
    return { ok: false, reason: "Input is empty." };
  }

  const format = detectTableFormat(trimmed);
  if (!format) {
    return { ok: false, reason: "Could not detect a supported table format. Try HTML, Markdown, TSV, or CSV." };
  }

  try {
    let data: TableData;
    switch (format) {
      case "html":
        data = parseHtmlTable(trimmed);
        break;
      case "markdown":
        data = parseMarkdownTable(trimmed);
        break;
      case "tsv":
        data = parseTsv(trimmed);
        break;
      case "csv":
        data = parseCsv(trimmed);
        break;
      case "plain":
        data = parsePlainTextTable(trimmed);
        break;
      default:
        return { ok: false, reason: "Unsupported format." };
    }
    return { ok: true, data };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Parse failed.";
    return { ok: false, reason: message };
  }
}

export { detectTableFormat, parseHtmlTable, parseMarkdownTable, parseTsv, parseCsv, parsePlainTextTable };
export type { TableFormat };
