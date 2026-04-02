import { useId } from "react";
import {
	Area,
	AreaChart,
	CartesianGrid,
	ReferenceLine,
	XAxis,
	YAxis,
} from "recharts";
import { formatCurrency } from "@/lib/format";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { formatShortDate } from "./trend-line-data";

type TrendLineMonthlyChartProps = {
	monthlyChartData: { month: string; spend: number }[];
	averageActiveMonthSpend: number;
	monthsWithSpend: number;
	lastActiveDate: string | null;
};

export function TrendLineMonthlyChart({
	monthlyChartData,
	averageActiveMonthSpend,
	monthsWithSpend,
	lastActiveDate,
}: TrendLineMonthlyChartProps) {
	const gradientId = useId().replace(/:/g, "");

	return (
		<section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
			<div className="flex flex-wrap items-start justify-between gap-4">
				<div>
					<p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
						Monthly pacing
					</p>
					<h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">
						Which months carried the year
					</h3>
					<p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
						Each month stays on the chart, including the quiet ones, so the spikes
						and gaps are easy to compare at a glance.
					</p>
				</div>
				<div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
					{monthsWithSpend} active month{monthsWithSpend === 1 ? "" : "s"}
				</div>
			</div>
			<div className="mt-6 h-80">
				<ChartContainer
					config={{
						spend: { label: "Spend", color: "var(--color-chart-1)" },
					}}
					className="h-full w-full"
				>
					<AreaChart
						data={monthlyChartData}
						margin={{ top: 8, right: 12, left: 12, bottom: 0 }}
					>
						<defs>
							<linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
								<stop
									offset="5%"
									stopColor="var(--color-spend)"
									stopOpacity={0.35}
								/>
								<stop
									offset="95%"
									stopColor="var(--color-spend)"
									stopOpacity={0.04}
								/>
							</linearGradient>
						</defs>
						<CartesianGrid vertical={false} stroke="rgba(148, 163, 184, 0.22)" />
						<XAxis
							dataKey="month"
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							className="text-xs text-slate-500"
						/>
						<YAxis
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							tickFormatter={(value) => formatCurrency(Number(value))}
							className="text-xs text-slate-500"
						/>
						{averageActiveMonthSpend > 0 ? (
							<ReferenceLine
								y={averageActiveMonthSpend}
								stroke="rgba(15, 23, 42, 0.35)"
								strokeDasharray="4 4"
							/>
						) : null}
						<ChartTooltip
							cursor={{ stroke: "rgba(15, 23, 42, 0.2)", strokeWidth: 1 }}
							content={
								<ChartTooltipContent
									indicator="line"
									formatter={(value) => formatCurrency(Number(value))}
								/>
							}
						/>
						<Area
							type="monotone"
							dataKey="spend"
							name="Spend"
							stroke="var(--color-spend)"
							strokeWidth={2.5}
							fill={`url(#${gradientId})`}
							activeDot={{ r: 5, strokeWidth: 0 }}
						/>
					</AreaChart>
				</ChartContainer>
			</div>
			<div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 text-xs text-slate-500">
				<div>Average active month: {formatCurrency(averageActiveMonthSpend)}</div>
				<div>
					Last recorded expense day:{" "}
					{lastActiveDate ? formatShortDate(lastActiveDate) : "No data yet"}
				</div>
			</div>
		</section>
	);
}
