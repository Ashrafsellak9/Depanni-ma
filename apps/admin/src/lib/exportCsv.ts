import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

export function exportRowsToCsv<T extends Record<string, unknown>>(
  rows: T[],
  filename: string,
  columns?: { key: keyof T; header: string }[],
) {
  if (rows.length === 0) return;

  const sheet = columns
    ? rows.map((row) =>
        Object.fromEntries(columns.map((c) => [c.header, row[c.key] ?? ""])),
      )
    : rows;

  const ws = XLSX.utils.json_to_sheet(sheet);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Export");
  const blob = new Blob([XLSX.write(wb, { bookType: "csv", type: "array" })], {
    type: "text/csv;charset=utf-8",
  });
  saveAs(blob, `${filename}.csv`);
}
