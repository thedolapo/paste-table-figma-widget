import type { TableCell, TableRow, TableData } from "../types";
import { tableDataFromRows } from "../types";

/**
 * Parse CSV (comma-separated, quoted fields) into TableData.
 * No header detection; hasHeaderRow false.
 */
export function parseCsv(input: string): TableData {
  const rows: TableRow[] = [];
  const lines = splitCsvLines(input);

  for (const line of lines) {
    const cells = parseCsvLine(line).map((v) => ({ value: v }));
    if (cells.length > 0) rows.push({ cells });
  }

  return tableDataFromRows(rows, false);
}

function splitCsvLines(input: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < input.length; i++) {
    const c = input[i];
    if (c === '"') {
      inQuotes = !inQuotes;
      current += c;
    } else if (c === "\n" && !inQuotes) {
      result.push(current);
      current = "";
    } else if (c !== "\r") {
      current += c;
    }
  }
  if (current.length > 0) result.push(current);
  return result;
}

function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      inQuotes = !inQuotes;
      current += c;
    } else if (c === "," && !inQuotes) {
      fields.push(unquoteCsvField(current));
      current = "";
    } else {
      current += c;
    }
  }
  fields.push(unquoteCsvField(current));
  return fields;
}

function unquoteCsvField(field: string): string {
  const trimmed = field.trim();
  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    return trimmed
      .slice(1, -1)
      .replace(/""/g, '"')
      .trim();
  }
  return trimmed;
}
