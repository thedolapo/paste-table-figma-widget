import type { TableCell, TableRow, TableData } from "../types";
import { tableDataFromRows } from "../types";

/**
 * Parse TSV (tab-separated) into TableData.
 * No header detection; hasHeaderRow false.
 */
export function parseTsv(input: string): TableData {
  const lines = input.split(/\r?\n/).filter((l) => l.length > 0 || l.includes("\t"));
  const rows: TableRow[] = [];

  for (const line of lines) {
    const cells = line.split(/\t/).map((v) => ({ value: v.trim() }));
    if (cells.length > 0) rows.push({ cells });
  }

  return tableDataFromRows(rows, false);
}
