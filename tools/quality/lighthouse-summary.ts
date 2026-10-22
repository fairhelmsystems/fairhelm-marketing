export type AuditReport = {
  requestedUrl: string;
  finalDisplayedUrl: string;
  lighthouseVersion: string;
  fetchTime: string;
  runtimeError?: { message: string };
  categories: Record<string, { score: number | null }>;
  audits: Record<string, { numericValue?: number }>;
};

const categories = ["performance", "accessibility", "best-practices", "seo"] as const;
const metrics = [
  "largest-contentful-paint",
  "total-blocking-time",
  "cumulative-layout-shift",
] as const;

function median(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

/** Missing audits must never look like a passing score or a zero-time metric. */
export function summarize(reports: AuditReport[]) {
  if (reports.length === 0) throw new Error("No Lighthouse reports to summarize");
  for (const report of reports) {
    if (report.runtimeError) throw new Error(report.runtimeError.message);
    if (report.finalDisplayedUrl !== report.requestedUrl)
      throw new Error(
        `Unexpected navigation: ${report.requestedUrl} -> ${report.finalDisplayedUrl}`
      );
    for (const category of categories) {
      const score = report.categories[category]?.score;
      if (typeof score !== "number" || !Number.isFinite(score) || score < 0 || score > 1)
        throw new Error(`Missing or invalid category: ${category}`);
    }
    for (const metric of metrics) {
      if (!Number.isFinite(report.audits[metric]?.numericValue))
        throw new Error(`Missing or invalid metric: ${metric}`);
    }
  }
  return {
    runs: reports.length,
    versions: [...new Set(reports.map((report) => report.lighthouseVersion))],
    medianScores: Object.fromEntries(
      categories.map((key) => [
        key,
        Math.round(median(reports.map((report) => report.categories[key].score as number)) * 100),
      ])
    ),
    medianMetrics: Object.fromEntries(
      metrics.map((key) => [
        key,
        median(reports.map((report) => report.audits[key].numericValue as number)),
      ])
    ),
  };
}
