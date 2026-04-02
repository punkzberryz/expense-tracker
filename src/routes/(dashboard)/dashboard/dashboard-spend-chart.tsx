import { useId } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { formatCurrency } from "@/lib/format";
import type { DashboardData } from "./dashboard-data";

type DashboardSpendChartProps = {
	data: DashboardData;
};

export function DashboardSpendChart({ data }: DashboardSpendChartProps) {
	const gradientId = useId().replace(/:/g, "");

	return (
		<div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
			<div className="flex items-start justify-between gap-4">
				<div>
					<p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
						Spend momentum
					</p>
					<h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">
						Monthly pacing through {data.focusYear}
					</h2>
				</div>
				<div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
					{data.monthsWithSpend} active months
				</div>
			</div>
			<p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
				The home page should show motion, not just totals. This chart gives the
				user immediate context before they jump into the full trend-line view.
			</p>
			<div className="mt-6 h-72">
				<ChartContainer
					config={{
						spend: { label: "Spend", color: "var(--color-chart-2)" },
					}}
					className="h-full w-full"
				>
					<AreaChart
						data={data.monthlyChartData}
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
									stopOpacity={0.02}
								/>
							</linearGradient>
						</defs>
						<CartesianGrid vertical={false} stroke="rgba(148, 163, 184, 0.2)" />
						<XAxis
							dataKey="month"
							axisLine={false}
							tickLine={false}
							tickMargin={8}
							className="text-xs text-slate-500"
						/>
						<YAxis
							axisLine={false}
							tickLine={false}
							tickMargin={8}
							className="text-xs text-slate-500"
							tickFormatter={(value) => formatCurrency(Number(value))}
						/>
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
						/>
					</AreaChart>
				</ChartContainer>
			</div>
		</div>
	);
}
