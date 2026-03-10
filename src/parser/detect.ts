export type TableFormat = "html" | "markdown" | "tsv" | "csv" | "plain";

/**
 * Detect table format in detection order: HTML → Markdown → TSV → CSV → plain.
 */
export function detectTableFormat(input: string): TableFormat | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  if (/<\s*table[\s>]/i.test(trimmed)) return "html";
  const hasPipeRows = /^\s*\|.+\|/.test(trimmed);
  const hasSeparatorLine = new RegExp("^\\s*\\|[\\s\-:]+\\|", "m").test(trimmed);
  if (hasPipeRows && hasSeparatorLine) return "markdown";
  if (isLikelyTsv(trimmed)) return "tsv";
  if (isLikelyCsv(trimmed)) return "csv";
  if (hasConsistentColumns(trimmed)) return "plain";

  return null;
}

function isLikelyTsv(input: string): boolean {
  const lines = input.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 1) return false;
  const firstLineTabs = (lines[0].match(/\t/g) || []).length;
  if (firstLineTabs === 0) return false;
  return lines.every((line) => (line.match(/\t/g) || []).length === firstLineTabs);
}

function isLikelyCsv(input: string): boolean {
  const lines = input.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 1) return false;
  const firstLineCommas = countCsvColumns(lines[0]);
  if (firstLineCommas < 1) return false;
  for (let i = 1; i < lines.length; i++) {
    if (countCsvColumns(lines[i]) !== firstLineCommas) return false;
  }
  return true;
}

function countCsvColumns(line: string): number {
  let cols = 0;
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') inQuotes = !inQuotes;
    else if (!inQuotes && c === ",") cols++;
  }
  return cols + 1;
}

function hasConsistentColumns(input: string): boolean {
  const lines = input.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 1) return false;
  const firstColCount = splitPlainColumns(lines[0]).length;
  if (firstColCount < 1) return false;
  return lines.every((line) => splitPlainColumns(line).length === firstColCount);
}

function splitPlainColumns(line: string): string[] {
  const trimmed = line.trim();
  if (trimmed === "") return [];
  const byTabs = trimmed.split(/\t+/);
  if (byTabs.length > 1) return byTabs.map((c) => c.trim());
  const bySpaces = trimmed.split(/\s{2,}/);
  if (bySpaces.length > 1) return bySpaces.map((c) => c.trim());
  return [trimmed];
}
