import type { TableCell, TableRow, TableData } from "../types";
import { tableDataFromRows } from "../types";

/**
 * Parse plain text table (consistent columns by tabs or multiple spaces) into TableData.
 * No header detection; hasHeaderRow false.
 */
export function parsePlainTextTable(input: string): TableData {
  const lines = input.split(/\r?\n/).filter((l) => l.trim().length > 0);
  const rows: TableRow[] = [];

  for (const line of lines) {
    const cells = splitPlainColumns(line).map((v) => ({ value: v }));
    if (cells.length > 0) rows.push({ cells });
  }

  return tableDataFromRows(rows, false);
}

function splitPlainColumns(line: string): string[] {
  const trimmed = line.trim();
  if (trimmed === "") return [];
  const byTabs = trimmed.split(/\t+/).map((c) => c.trim());
  if (byTabs.length > 1) return byTabs;
  const bySpaces = trimmed.split(/\s{2,}/).map((c) => c.trim());
  if (bySpaces.length > 1) return bySpaces;
  return [trimmed];
}
