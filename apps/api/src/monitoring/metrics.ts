import {
  Counter,
  Histogram,
  Registry,
  collectDefaultMetrics,
} from "prom-client";
import type { Request, Response, NextFunction } from "express";

const register = new Registry();
collectDefaultMetrics({ register, prefix: "depanni_" });

export const jobsCreatedTotal = new Counter({
  name: "depanni_jobs_created_total",
  help: "Total job requests created",
  registers: [register],
});

export const offersSubmittedTotal = new Counter({
  name: "depanni_offers_submitted_total",
  help: "Total offers submitted by artisans",
  registers: [register],
});

export const missionsCompletedTotal = new Counter({
  name: "depanni_missions_completed_total",
  help: "Total missions marked completed",
  registers: [register],
});

export const httpRequestDurationMs = new Histogram({
  name: "http_request_duration_ms",
  help: "HTTP request duration in milliseconds",
  labelNames: ["method", "route", "status_code"] as const,
  buckets: [5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000],
  registers: [register],
});

export function metricsMiddleware(req: Request, res: Response, next: NextFunction): void {
  const start = process.hrtime.bigint();
  res.on("finish", () => {
    const elapsedMs = Number(process.hrtime.bigint() - start) / 1e6;
    const route =
      (req.route?.path as string | undefined) ??
      req.baseUrl + (req.path === "/" ? "" : req.path);
    httpRequestDurationMs.observe(
      { method: req.method, route: route || "unknown", status_code: String(res.statusCode) },
      elapsedMs,
    );
  });
  next();
}

export async function getMetricsText(): Promise<string> {
  return register.metrics();
}

export function getMetricsContentType(): string {
  return register.contentType;
}
