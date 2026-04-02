import { useEffect, useState } from "react";
import {
	Bar,
	CartesianGrid,
	ComposedChart,
	Line,
	XAxis,
	YAxis,
} from "recharts";
import { formatCurrency } from "@/lib/format";
import {
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
} from "@/components/ui/chart";
import {
	DailyPurchasePanel,
	DailyTooltipTracker,
} from "./daily-tooltip-tracker";
import { formatShortDate } from "./trend-line-data";
import type { ExpenseRow } from "@/data/google-sheets";

type TrendLineDailySectionProps = {
	dailyChartData: { date: string; daily: number; cumulative: number }[];
	dailyRowsByDate: Map<string, ExpenseRow[]>;
	lastActiveDate: string | null;
};

export function TrendLineDailySection({
	dailyChartData,
	dailyRowsByDate,
	lastActiveDate,
}: TrendLineDailySectionProps) {
	const latestDate = dailyChartData.at(-1)?.date ?? null;
	const [hoveredDate, setHoveredDate] = useState<string | null>(latestDate);

	useEffect(() => {
		if (!hoveredDate || !dailyRowsByDate.has(hoveredDate)) {
			setHoveredDate(latestDate);
		}
	}, [dailyRowsByDate, hoveredDate, latestDate]);

	return (
		<section className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.8fr)]">
			<div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
				<div className="flex flex-wrap items-start justify-between gap-4">
					<div>
						<p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
							Daily buildup
						</p>
						<h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">
							See how the running total formed day by day
						</h3>
						<p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
							Bars show what landed on a given day, while the line reveals how fast
							the year accumulated after each purchase.
						</p>
					</div>
					<div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
						{dailyChartData.length} tracked day{dailyChartData.length === 1 ? "" : "s"}
					</div>
				</div>
				<div className="mt-6 h-80">
					<ChartContainer
						config={{
							daily: { label: "Daily spend", color: "var(--color-chart-2)" },
							cumulative: {
								label: "Cumulative spend",
								color: "var(--color-chart-1)",
							},
						}}
						className="h-full w-full"
					>
						<ComposedChart
							data={dailyChartData}
							margin={{ top: 8, right: 12, left: 12, bottom: 0 }}
						>
							<CartesianGrid
								vertical={false}
								stroke="rgba(148, 163, 184, 0.2)"
							/>
							<XAxis
								dataKey="date"
								tickLine={false}
								axisLine={false}
								tickMargin={8}
								tickFormatter={formatShortDate}
								className="text-xs text-slate-500"
							/>
							<YAxis
								tickLine={false}
								axisLine={false}
								tickMargin={8}
								tickFormatter={(value) => formatCurrency(Number(value))}
								className="text-xs text-slate-500"
							/>
							<ChartTooltip
								cursor={{ fill: "rgba(15, 23, 42, 0.04)" }}
								content={<DailyTooltipTracker onHover={setHoveredDate} />}
							/>
							<ChartLegend content={<ChartLegendContent />} />
							<Bar
								dataKey="daily"
								name="Daily spend"
								fill="var(--color-daily)"
								radius={[6, 6, 0, 0]}
							/>
							<Line
								type="monotone"
								dataKey="cumulative"
								name="Cumulative spend"
								stroke="var(--color-cumulative)"
								strokeWidth={2.5}
								dot={false}
							/>
						</ComposedChart>
					</ChartContainer>
				</div>
				<div className="mt-4 border-t border-slate-100 pt-4 text-xs text-slate-500">
					Defaulting to the latest recorded day keeps the detail panel useful
					even before you hover the chart.
				</div>
			</div>
			<DailyPurchasePanel
				date={hoveredDate}
				rows={hoveredDate ? (dailyRowsByDate.get(hoveredDate) ?? []) : []}
				latestDate={lastActiveDate}
			/>
		</section>
	);
}
