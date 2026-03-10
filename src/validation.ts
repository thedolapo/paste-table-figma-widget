import type { TableData } from "./types";

export const MAX_ROWS = 50;
export const MAX_COLUMNS = 12;
export const MIN_ROWS = 1;
export const MIN_COLUMNS = 1;

export type ValidationResult =
  | { ok: true }
  | { ok: false; reason: string };

export function validateTableData(data: TableData): ValidationResult {
  if (!data.rows || data.rows.length === 0) {
    return { ok: false, reason: "Table must have at least one row." };
  }

  if (data.rowCount > MAX_ROWS) {
    return { ok: false, reason: `Table has too many rows. Maximum is ${MAX_ROWS} rows.` };
  }

  if (data.columnCount > MAX_COLUMNS) {
    return { ok: false, reason: `Table has too many columns. Maximum is ${MAX_COLUMNS} columns.` };
  }

  if (data.columnCount < MIN_COLUMNS) {
    return { ok: false, reason: "Table must have at least one column." };
  }

  const expectedCols = data.columnCount;
  for (let i = 0; i < data.rows.length; i++) {
    const row = data.rows[i];
    const actual = row.cells ? row.cells.length : 0;
    if (actual !== expectedCols) {
      return {
        ok: false,
        reason: `Row ${i + 1} has ${actual} columns; expected ${expectedCols}. All rows must have the same number of columns.`,
      };
    }
  }

  return { ok: true };
}
