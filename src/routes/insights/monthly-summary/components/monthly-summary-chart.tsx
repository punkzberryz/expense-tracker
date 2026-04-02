import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { formatCurrency } from "@/lib/format";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import type { MonthlyDatum } from "./monthly-summary-data";

const compactCurrencyFormatter = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
	notation: "compact",
	maximumFractionDigits: 1,
});
const percentFormatter = new Intl.NumberFormat("en-US", {
	style: "percent",
	maximumFractionDigits: 1,
});

type MonthlySummaryChartProps = {
	monthlyData: MonthlyDatum[];
	totalSpend: number;
};

export function MonthlySummaryChart({
	monthlyData,
	totalSpend,
}: MonthlySummaryChartProps) {
	const activeMonths = monthlyData.filter((month) => month.total > 0);
	const topMonths = [...activeMonths]
		.sort((left, right) => right.total - left.total)
		.slice(0, 3);

	return (
		<section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
				<div>
					<h3 className="text-lg font-semibold text-slate-950">
						Monthly cadence
					</h3>
					<p className="mt-1 text-sm leading-6 text-slate-600">
						Compare all twelve months side by side and use the leaderboard to see
						which stretches dominated the year.
					</p>
				</div>
				<div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
					{activeMonths.length} active month{activeMonths.length === 1 ? "" : "s"}
				</div>
			</div>
			<div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_15rem]">
				<ChartContainer
					config={{
						total: { label: "Spend", color: "var(--color-chart-2)" },
					}}
					className="h-72 w-full"
				>
					<BarChart data={monthlyData} margin={{ left: 4, right: 8, top: 8 }}>
						<defs>
							<linearGradient id="monthly-summary-bars" x1="0" x2="0" y1="0" y2="1">
								<stop offset="0%" stopColor="#0f766e" />
								<stop offset="100%" stopColor="#38bdf8" />
							</linearGradient>
						</defs>
						<CartesianGrid
							vertical={false}
							stroke="rgba(148, 163, 184, 0.25)"
							strokeDasharray="4 4"
						/>
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
							tickMargin={10}
							tickFormatter={(value) =>
								compactCurrencyFormatter.format(Number(value))
							}
							className="text-xs text-slate-500"
						/>
						<ChartTooltip
							cursor={{ fill: "rgba(15, 23, 42, 0.06)" }}
							content={
								<ChartTooltipContent
									indicator="dot"
									formatter={(value) => formatCurrency(Number(value))}
								/>
							}
						/>
						<Bar
							dataKey="total"
							name="Spend"
							fill="url(#monthly-summary-bars)"
							radius={[12, 12, 4, 4]}
						/>
					</BarChart>
				</ChartContainer>
				<div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
					<p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
						Top months
					</p>
					<div className="mt-4 space-y-3">
						{topMonths.length > 0 ? (
							topMonths.map((month) => (
								<div
									key={month.month}
									className="rounded-2xl border border-white bg-white p-3 shadow-sm"
								>
									<div className="flex items-center justify-between gap-3">
										<div className="text-sm font-semibold text-slate-900">
											{month.month}
										</div>
										<div className="text-xs font-medium text-slate-500">
											{percentFormatter.format(month.share)}
										</div>
									</div>
									<div className="mt-2 text-base font-semibold text-slate-950">
										{formatCurrency(month.total)}
									</div>
									<p className="mt-1 text-xs leading-5 text-slate-500">
										{month.count} transaction{month.count === 1 ? "" : "s"} at an
										average of {formatCurrency(month.average)}
									</p>
								</div>
							))
						) : (
							<div className="rounded-2xl border border-dashed border-slate-200 bg-white p-4 text-sm text-slate-500">
								No ranked months yet.
							</div>
						)}
					</div>
					<p className="mt-4 text-xs leading-5 text-slate-500">
						Annual total represented here: {formatCurrency(totalSpend)}.
					</p>
				</div>
			</div>
		</section>
	);
}
