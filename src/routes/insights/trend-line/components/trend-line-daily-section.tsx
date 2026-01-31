import { useState } from "react";
import { Bar, ComposedChart, Line, XAxis, YAxis } from "recharts";
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
};

export function TrendLineDailySection({
	dailyChartData,
	dailyRowsByDate,
}: TrendLineDailySectionProps) {
	const [hoveredDate, setHoveredDate] = useState<string | null>(null);

	return (
		<div className="mt-6">
			<h3 className="text-sm font-semibold text-slate-900">
				Accumulated spending (daily)
			</h3>
			<p className="text-xs text-slate-500">
				Running total based on each day&apos;s expenses.
			</p>
			<div className="mt-3">
				<ChartContainer
					config={{
						daily: { label: "Daily spend", color: "var(--color-chart-2)" },
						cumulative: {
							label: "Cumulative spend",
							color: "var(--color-chart-1)",
						},
					}}
					className="h-48 w-full"
				>
					<ComposedChart data={dailyChartData} margin={{ left: 8, right: 8 }}>
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
							cursor={{ stroke: "var(--color-chart-1)", strokeWidth: 1 }}
							content={<DailyTooltipTracker onHover={setHoveredDate} />}
						/>
						<ChartLegend content={<ChartLegendContent />} />
						<Bar
							dataKey="daily"
							name="Daily spend"
							fill="var(--color-daily)"
							radius={[3, 3, 0, 0]}
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
			<DailyPurchasePanel
				date={hoveredDate}
				rows={hoveredDate ? (dailyRowsByDate.get(hoveredDate) ?? []) : []}
			/>
		</div>
	);
}
