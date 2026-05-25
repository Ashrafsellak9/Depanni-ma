import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

import type { RevenueReport } from "@/types/analytics";

export function exportTransactionsXlsx(data: {
  missions: Record<string, unknown>[];
  walletTransactions: Record<string, unknown>[];
  payouts: Record<string, unknown>[];
}) {
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(data.missions), "Missions");
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(data.walletTransactions), "Wallet");
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(data.payouts), "Virements");
  const blob = new Blob([XLSX.write(wb, { bookType: "xlsx", type: "array" })], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, `depanni-transactions-${new Date().toISOString().slice(0, 10)}.xlsx`);
}

export function exportRevenuePdf(report: RevenueReport, title: string) {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text(`DEPANNI — ${title}`, 14, 20);
  doc.setFontSize(11);
  doc.text(`GMV: ${report.summary.gmv} MAD | Revenus: ${report.summary.depanniRevenue} MAD`, 14, 30);
  doc.text(
    `Croissance GMV: ${report.summary.gmvGrowth}% | Commission moy.: ${(report.summary.avgCommissionRate * 100).toFixed(1)}%`,
    14,
    38,
  );
  doc.text(
    `Projection mois: GMV ${report.projection.projectedGmv} MAD — Revenus ${report.projection.projectedRevenue} MAD`,
    14,
    46,
  );

  autoTable(doc, {
    startY: 54,
    head: [["Période", "GMV", "Revenu DEPANNI", "Taux moy."]],
    body: report.periods.map((p) => [
      p.label,
      `${p.gmv} MAD`,
      `${p.revenue} MAD`,
      `${(p.avgRate * 100).toFixed(1)}%`,
    ]),
  });

  autoTable(doc, {
    startY: (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10,
    head: [["Catégorie", "GMV", "Revenu", "Missions"]],
    body: report.byCategory.map((c) => [
      c.category,
      `${c.gmv} MAD`,
      `${c.revenue} MAD`,
      String(c.missions),
    ]),
  });

  doc.save(`depanni-rapport-${new Date().toISOString().slice(0, 10)}.pdf`);
}

export function exportPayoutsCsv(
  rows: Array<{
    artisan: string;
    amount: number;
    iban: string;
    status: string;
    date: string;
  }>,
) {
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Virements");
  const blob = new Blob([XLSX.write(wb, { bookType: "csv", type: "array" })], {
    type: "text/csv;charset=utf-8",
  });
  saveAs(blob, `virements-${new Date().toISOString().slice(0, 10)}.csv`);
}
