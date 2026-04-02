import { Link } from "@tanstack/react-router";
import { ArrowRightIcon, ExternalLinkIcon, SparklesIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";
import type { DashboardData } from "./dashboard-data";

type DashboardHeroProps = {
  data: DashboardData;
  googleSheetUrl: string;
};

const formatChange = (value: number | null) => {
  if (value === null) return "First active month";

  const rounded = Math.abs(value).toFixed(1);
  if (value > 0) return `Up ${rounded}% vs prior month`;
  if (value < 0) return `Down ${rounded}% vs prior month`;
  return "Flat vs prior month";
};

export function DashboardHero({ data, googleSheetUrl }: DashboardHeroProps) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-gradient-to-br from-amber-50 via-white to-teal-50 p-6 shadow-sm">
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.9fr)]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/80 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-600 shadow-sm backdrop-blur">
            <SparklesIcon className="size-3.5 text-amber-500" />
            Latest sheet overview
          </div>
          <h1 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            The dashboard should answer, in one screen, where the money is going
            and what changed recently.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            This version centers the latest year sheet, highlights the newest
            spending month, and makes the detailed insight pages feel like drill
            downs instead of separate destinations.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/expense/$year"
              params={{ year: data.focusYear }}
              className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
            >
              Open {data.focusYear} expenses
              <ArrowRightIcon className="size-4" />
            </Link>
            <Link
              to="/insights/trend-line/$year"
              params={{ year: data.focusYear }}
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              View trend line
            </Link>
            <Button
              asChild
              variant="outline"
              className="rounded-full border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
            >
              <a href={googleSheetUrl} target="_blank" rel="noopener">
                Open Google Sheet
                <ExternalLinkIcon className="size-4" />
              </a>
            </Button>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {data.availableYears.map((year) => (
              <Link
                key={year}
                to="/expense/$year"
                params={{ year }}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  year === data.focusYear
                    ? "bg-slate-950 text-white"
                    : "border border-slate-300 bg-white text-slate-600 hover:border-slate-400 hover:text-slate-900"
                }`}
              >
                Sheet {year}
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-[24px] border border-white/80 bg-white/85 p-5 shadow-sm backdrop-blur">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
            {data.focusYear} snapshot
          </p>
          <div className="mt-4">
            <p className="text-4xl font-semibold tracking-tight text-slate-950">
              {formatCurrency(data.totalSpend)}
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Total recorded spend across {data.monthsWithSpend} active months.
            </p>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <div className="rounded-2xl bg-slate-950 p-4 text-white">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-300">
                Latest active month
              </p>
              <p className="mt-2 text-xl font-semibold">
                {data.currentMonthLabel ?? "No data"}
              </p>
              <p className="mt-1 text-sm text-slate-300">
                {formatCurrency(data.currentMonthSpend)}
              </p>
              <p className="mt-3 text-xs text-slate-400">
                {formatChange(data.monthOverMonthChange)}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                Peak month
              </p>
              <p className="mt-2 text-xl font-semibold text-slate-950">
                {data.peakMonthLabel ?? "No data"}
              </p>
              <p className="mt-1 text-sm text-slate-600">
                {formatCurrency(data.peakMonthSpend)}
              </p>
              <p className="mt-3 text-xs text-slate-500">
                Top category: {data.topCategory ?? "No category yet"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
