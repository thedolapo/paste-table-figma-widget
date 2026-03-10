import type { TableCell, TableRow, TableData } from "../types";
import { tableDataFromRows } from "../types";

/**
 * Parse markdown table (pipe-delimited, optional alignment row) into TableData.
 * First row is header when a separator line (e.g. |---|) is present.
 */
export function parseMarkdownTable(input: string): TableData {
  const lines = input.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);
  const rows: TableRow[] = [];
  let hasHeaderRow = false;
  let skipNext = false;

  for (let i = 0; i < lines.length; i++) {
    if (skipNext) {
      skipNext = false;
      continue;
    }
    const line = lines[i];
    if (!line.startsWith("|")) continue;

    const cells = splitMarkdownRow(line);
    if (cells.length === 0) continue;

    const isSeparator = cells.every((c) => /^[\s\-:]+$/.test(c));
    if (isSeparator) {
      if (rows.length > 0) hasHeaderRow = true;
      continue;
    }

    rows.push({ cells: cells.map((v) => ({ value: v.trim() })) });
  }

  return tableDataFromRows(rows, hasHeaderRow);
}

function splitMarkdownRow(line: string): string[] {
  const withoutLeadingTrailingPipe = line.replace(/^\|/, "").replace(/\|$/, "");
  return withoutLeadingTrailingPipe.split("|").map((c) => c.trim());
}
