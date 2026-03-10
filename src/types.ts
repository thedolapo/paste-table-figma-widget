/**
 * Internal data model for table content.
 * Serialisable for widget synced state.
 */
export interface TableCell {
  value: string;
}

export interface TableRow {
  cells: TableCell[];
}

export interface TableData {
  rows: TableRow[];
  columnCount: number;
  rowCount: number;
  hasHeaderRow: boolean;
}

export function createEmptyTableData(): TableData {
  return {
    rows: [{ cells: [{ value: "" }] }],
    columnCount: 1,
    rowCount: 1,
    hasHeaderRow: false,
  };
}

export function tableDataFromRows(rows: TableRow[], hasHeaderRow: boolean): TableData {
  const rowCount = rows.length;
  const columnCount = rows.length > 0 ? rows[0].cells.length : 0;
  return { rows, columnCount, rowCount, hasHeaderRow };
}
