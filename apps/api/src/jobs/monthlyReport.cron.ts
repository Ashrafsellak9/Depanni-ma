import { env } from "../config/env.js";
import { enqueueEmail } from "./emailQueue.js";
import { adminFinancesService } from "../modules/admin/admin.finances.service.js";
import { logger } from "../utils/logger.js";

let lastRunMonth = "";

/** Vérifie chaque heure si on est le 1er du mois (8h) pour envoyer le rapport comptable. */
export function startMonthlyReportScheduler(): void {
  const tick = async () => {
    const now = new Date();
    const monthKey = `${now.getFullYear()}-${now.getMonth()}`;
    if (now.getDate() !== 1 || now.getHours() !== 8) return;
    if (lastRunMonth === monthKey) return;
    if (!env.ACCOUNTING_EMAIL) return;

    lastRunMonth = monthKey;

    try {
      const report = await adminFinancesService.getMonthlyReportData();
      const s = report.revenue.summary;

      await enqueueEmail({
        to: env.ACCOUNTING_EMAIL,
        subject: `DEPANNI — Rapport financier ${report.month}`,
        html: `
          <h1>Rapport mensuel DEPANNI — ${report.month}</h1>
          <ul>
            <li><strong>GMV :</strong> ${s.gmv} MAD (${s.gmvGrowth >= 0 ? "+" : ""}${s.gmvGrowth}%)</li>
            <li><strong>Revenus DEPANNI :</strong> ${s.depanniRevenue} MAD</li>
            <li><strong>Missions complétées :</strong> ${s.missionCount}</li>
            <li><strong>Taux commission moyen :</strong> ${(s.avgCommissionRate * 100).toFixed(1)}%</li>
          </ul>
          <p>Projection fin de mois en cours : GMV ${report.revenue.projection.projectedGmv} MAD</p>
          <p>Export détaillé disponible dans l'admin DEPANNI.</p>
        `,
      });

      logger.info("Monthly accounting report enqueued", { month: report.month });
    } catch (err) {
      logger.error("Monthly report failed", { err: String(err) });
      lastRunMonth = "";
    }
  };

  void tick();
  setInterval(() => void tick(), 60 * 60 * 1000);
  logger.info("Monthly report scheduler active (1st of month, 08:00)");
}
