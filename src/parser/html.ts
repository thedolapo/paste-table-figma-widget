import type { TableCell, TableRow, TableData } from "../types";
import { tableDataFromRows } from "../types";

/**
 * Parse HTML table into TableData.
 * Uses regex / simple parsing (no DOM). Handles <table>, <tr>, <th>, <td>.
 */
export function parseHtmlTable(html: string): TableData {
  const trimmed = html.trim();
  const tableMatch = trimmed.match(/<table[^>]*>([\s\S]*?)<\/table>/i);
  const tableBody = tableMatch ? tableMatch[1] : trimmed;

  const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  const rows: TableRow[] = [];
  let rowMatch: RegExpExecArray | null;
  let hasHeaderRow = false;

  while ((rowMatch = rowRegex.exec(tableBody)) !== null) {
    const rowContent = rowMatch[1];
    const cells: TableCell[] = [];

    const thRegex = /<th[^>]*>([\s\S]*?)<\/th>/gi;
    const tdRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;

    let thMatch: RegExpExecArray | null;
    let tdMatch: RegExpExecArray | null;
    const thMatches: string[] = [];
    const tdMatches: string[] = [];

    while ((thMatch = thRegex.exec(rowContent)) !== null) {
      thMatches.push(stripTags(thMatch[1]).trim());
    }
    thRegex.lastIndex = 0;
    while ((tdMatch = tdRegex.exec(rowContent)) !== null) {
      tdMatches.push(stripTags(tdMatch[1]).trim());
    }

    if (thMatches.length > 0) {
      hasHeaderRow = rows.length === 0;
      thMatches.forEach((v) => cells.push({ value: v }));
    }
    if (tdMatches.length > 0) {
      tdMatches.forEach((v) => cells.push({ value: v }));
    }

    if (cells.length > 0) {
      rows.push({ cells });
    }
  }

  return tableDataFromRows(rows, hasHeaderRow);
}

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&quot;/g, '"');
}
