import { useEffect, useMemo, useState } from "react";
import {
	Bar,
	ComposedChart,
	Line,
	LineChart,
	type TooltipProps,
	XAxis,
	YAxis,
} from "recharts";
import { formatCurrency } from "@/lib/format";
import type { ExpenseRow } from "@/data/google-sheets";
import {
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import type {
	NameType,
	ValueType,
} from "recharts/types/component/DefaultTooltipContent";

const MONTH_LABELS = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec",
];

const parseYearMonth = (value: string) => {
	if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
	const [year, month] = value.split("-");
	const monthIndex = Number(month) - 1;
	if (monthIndex < 0 || monthIndex > 11) return null;
	return { year, monthIndex };
};

const parseYearDay = (value: string) => {
	if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
	const [year, month, day] = value.split("-");
	const monthIndex = Number(month) - 1;
	const dayIndex = Number(day);
	if (monthIndex < 0 || monthIndex > 11) return null;
	if (dayIndex < 1 || dayIndex > 31) return null;
	return { year };
};

const formatShortDate = (value: string) => {
	if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
	const [, month, day] = value.split("-");
	const monthIndex = Number(month) - 1;
	const label = MONTH_LABELS[monthIndex] ?? month;
	return `${label} ${Number(day)}`;
};

type TrendLineProps = {
	rows: ExpenseRow[];
	year: string;
};

export function TrendLine({ rows, year }: TrendLineProps) {
	const [hoveredDate, setHoveredDate] = useState<string | null>(null);
	const {
		monthlyTotals,
		totalSpend,
		peakMonthIndex,
		monthlyChartData,
		dailyChartData,
		dailyRowsByDate,
	} = useMemo(() => {
		const monthlyTotals = Array.from({ length: 12 }, () => 0);
		const dailyTotals = new Map<string, number>();
		const dailyRowsByDate = new Map<string, ExpenseRow[]>();
		for (const row of rows) {
			const parsed = parseYearMonth(row.date);
			if (parsed && parsed.year === year) {
				monthlyTotals[parsed.monthIndex] += row.amount;
			}
			const dayParsed = parseYearDay(row.date);
			if (dayParsed && dayParsed.year === year) {
				const dateKey = row.date;
				dailyTotals.set(dateKey, (dailyTotals.get(dateKey) ?? 0) + row.amount);
				const existing = dailyRowsByDate.get(dateKey);
				if (existing) {
					existing.push(row);
				} else {
					dailyRowsByDate.set(dateKey, [row]);
				}
			}
		}
		const totalSpend = monthlyTotals.reduce((sum, value) => sum + value, 0);
		const peakMonthIndex = totalSpend
			? monthlyTotals.indexOf(Math.max(...monthlyTotals))
			: -1;
		const monthlyChartData = monthlyTotals.map((value, index) => ({
			month: MONTH_LABELS[index],
			spend: Number(value.toFixed(2)),
		}));
		const dailyChartData = Array.from(dailyTotals.entries())
			.sort(([a], [b]) => a.localeCompare(b))
			.reduce<{ date: string; daily: number; cumulative: number }[]>(
				(acc, [date, daily]) => {
					const previous = acc[acc.length - 1]?.cumulative ?? 0;
					acc.push({
						date,
						daily: Number(daily.toFixed(2)),
						cumulative: Number((previous + daily).toFixed(2)),
					});
					return acc;
				},
				[],
			);
		return {
			monthlyTotals,
			totalSpend,
			peakMonthIndex,
			monthlyChartData,
			dailyChartData,
			dailyRowsByDate,
		};
	}, [rows, year]);

	if (totalSpend <= 0) {
		return (
			<div className="rounded-md border border-slate-200 bg-white p-4">
				<h2 className="text-lg font-semibold text-slate-900">Trend line</h2>
				<p className="mt-2 text-sm text-slate-500">
					No dated expenses available for this year.
				</p>
			</div>
		);
	}

	const peakLabel =
		peakMonthIndex >= 0
			? `${MONTH_LABELS[peakMonthIndex]} (${formatCurrency(
					monthlyTotals[peakMonthIndex],
				)})`
			: "—";

	return (
		<div className="rounded-md border border-slate-200 bg-white p-4">
			<div className="flex flex-wrap items-start justify-between gap-4">
				<div>
					<h2 className="text-lg font-semibold text-slate-900">Trend line</h2>
					<p className="text-sm text-slate-500">Monthly spend across {year}.</p>
				</div>
				<div className="text-right text-sm text-slate-600">
					<div>Total: {formatCurrency(totalSpend)}</div>
					<div>Peak month: {peakLabel}</div>
				</div>
			</div>

			<div className="mt-4">
				<ChartContainer
					config={{
						spend: { label: "Spend", color: "var(--color-chart-1)" },
					}}
					className="h-44 w-full"
				>
					<LineChart data={monthlyChartData} margin={{ left: 8, right: 8 }}>
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
						<ChartTooltip
							cursor={{ stroke: "var(--color-chart-1)", strokeWidth: 1 }}
							content={
								<ChartTooltipContent
									indicator="line"
									formatter={(value) => formatCurrency(Number(value))}
								/>
							}
						/>
						<Line
							type="monotone"
							dataKey="spend"
							name="Spend"
							stroke="var(--color-spend)"
							strokeWidth={2.5}
							dot={{ r: 3 }}
						/>
					</LineChart>
				</ChartContainer>
			</div>

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
		</div>
	);
}

const DailyTooltipTracker = ({
	active,
	payload,
	onHover,
}: TooltipProps<ValueType, NameType> & {
	onHover: (date: string | null) => void;
}) => {
	useEffect(() => {
		if (active && payload && payload.length) {
			const date = String(payload[0]?.payload?.date ?? "");
			onHover(date || null);
		}
	}, [active, payload, onHover]);
	return null;
};

const DailyPurchasePanel = ({
	date,
	rows,
}: {
	date: string | null;
	rows: ExpenseRow[];
}) => {
	if (!date) {
		return (
			<div className="mt-3 rounded-md border border-slate-200 bg-white p-3 text-xs text-slate-500">
				Hover a bar to see purchases for that day.
			</div>
		);
	}

	return (
		<div className="mt-3 rounded-md border border-slate-200 bg-white p-3 text-xs text-slate-600">
			<div className="font-semibold text-slate-900">
				{formatShortDate(date)}
			</div>
			{rows.length === 0 ? (
				<div className="mt-2 text-slate-500">No purchases recorded.</div>
			) : (
				<div className="mt-2 space-y-1">
					{rows.map((row, index) => (
						<div
							key={`${row.date}-${row.name}-${index}`}
							className="flex items-center justify-between gap-2"
						>
							<div className="truncate">
								{row.name}
								{row.category ? ` · ${row.category}` : ""}
							</div>
							<div className="font-medium">{formatCurrency(row.amount)}</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};
