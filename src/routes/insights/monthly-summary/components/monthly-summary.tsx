import { useMemo } from "react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import type { ExpenseRow } from "@/data/google-sheets";
import { formatCurrency } from "@/lib/format";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

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

const percentFormatter = new Intl.NumberFormat("en-US", {
	style: "percent",
	maximumFractionDigits: 1,
});

const parseYearMonth = (value: string) => {
	if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
	const [year, month] = value.split("-");
	const monthIndex = Number(month) - 1;
	if (monthIndex < 0 || monthIndex > 11) return null;
	return { year, monthIndex };
};

type MonthlySummaryProps = {
	rows: ExpenseRow[];
	year: string;
};

type MonthlyDatum = {
	month: string;
	total: number;
	count: number;
	average: number;
	share: number;
};

export function MonthlySummary({ rows, year }: MonthlySummaryProps) {
	const {
		monthlyData,
		totalSpend,
		monthsWithSpend,
		totalTransactions,
		peakMonthIndex,
		averageMonthlySpend,
		averageTransaction,
	} = useMemo(() => {
		const monthlyTotals = Array.from({ length: 12 }, () => 0);
		const monthlyCounts = Array.from({ length: 12 }, () => 0);
		for (const row of rows) {
			const parsed = parseYearMonth(row.date);
			if (!parsed || parsed.year !== year) continue;
			monthlyTotals[parsed.monthIndex] += row.amount;
			monthlyCounts[parsed.monthIndex] += 1;
		}
		const totalSpend = monthlyTotals.reduce((sum, value) => sum + value, 0);
		const totalTransactions = monthlyCounts.reduce(
			(sum, value) => sum + value,
			0,
		);
		const monthsWithSpend = monthlyTotals.filter((value) => value > 0).length;
		const peakMonthIndex = totalSpend
			? monthlyTotals.indexOf(Math.max(...monthlyTotals))
			: -1;
		const averageMonthlySpend = monthsWithSpend
			? totalSpend / monthsWithSpend
			: 0;
		const averageTransaction = totalTransactions
			? totalSpend / totalTransactions
			: 0;
		const monthlyData: MonthlyDatum[] = monthlyTotals.map((total, index) => {
			const count = monthlyCounts[index];
			const average = count ? total / count : 0;
			const share = totalSpend ? total / totalSpend : 0;
			return {
				month: MONTH_LABELS[index],
				total: Number(total.toFixed(2)),
				count,
				average: Number(average.toFixed(2)),
				share,
			};
		});
		return {
			monthlyData,
			totalSpend,
			monthsWithSpend,
			totalTransactions,
			peakMonthIndex,
			averageMonthlySpend,
			averageTransaction,
		};
	}, [rows, year]);

	if (totalSpend <= 0) {
		return (
			<div className="rounded-md border border-slate-200 bg-white p-4">
				<h2 className="text-lg font-semibold text-slate-900">
					Monthly summary
				</h2>
				<p className="mt-2 text-sm text-slate-500">
					No dated expenses available for this year.
				</p>
			</div>
		);
	}

	const peakLabel =
		peakMonthIndex >= 0
			? `${MONTH_LABELS[peakMonthIndex]} (${formatCurrency(
					monthlyData[peakMonthIndex]?.total ?? 0,
				)})`
			: "—";

	return (
		<div className="rounded-md border border-slate-200 bg-white p-4">
			<div className="flex flex-wrap items-start justify-between gap-4">
				<div>
					<h2 className="text-lg font-semibold text-slate-900">
						Monthly summary
					</h2>
					<p className="text-sm text-slate-500">
						Monthly totals for {year}.
					</p>
				</div>
				<div className="text-right text-sm text-slate-600">
					<div>Total: {formatCurrency(totalSpend)}</div>
					<div>Peak month: {peakLabel}</div>
				</div>
			</div>

			<div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
				<div className="rounded-md border border-slate-200 bg-white p-3">
					<div className="text-xs text-slate-500">Avg monthly spend</div>
					<div className="mt-1 text-lg font-semibold text-slate-900">
						{formatCurrency(averageMonthlySpend)}
					</div>
					<div className="text-xs text-slate-500">
						{monthsWithSpend} active months
					</div>
				</div>
				<div className="rounded-md border border-slate-200 bg-white p-3">
					<div className="text-xs text-slate-500">Transactions</div>
					<div className="mt-1 text-lg font-semibold text-slate-900">
						{totalTransactions}
					</div>
					<div className="text-xs text-slate-500">
						Avg {formatCurrency(averageTransaction)} per purchase
					</div>
				</div>
				<div className="rounded-md border border-slate-200 bg-white p-3">
					<div className="text-xs text-slate-500">Highest month</div>
					<div className="mt-1 text-lg font-semibold text-slate-900">
						{peakMonthIndex >= 0 ? MONTH_LABELS[peakMonthIndex] : "—"}
					</div>
					<div className="text-xs text-slate-500">
						{peakMonthIndex >= 0
							? formatCurrency(monthlyData[peakMonthIndex]?.total ?? 0)
							: "—"}
					</div>
				</div>
				<div className="rounded-md border border-slate-200 bg-white p-3">
					<div className="text-xs text-slate-500">Active months</div>
					<div className="mt-1 text-lg font-semibold text-slate-900">
						{monthsWithSpend} / 12
					</div>
					<div className="text-xs text-slate-500">Months with spend</div>
				</div>
			</div>

			<div className="mt-6">
				<ChartContainer
					config={{
						total: { label: "Spend", color: "var(--color-chart-1)" },
					}}
					className="h-48 w-full"
				>
					<BarChart data={monthlyData} margin={{ left: 8, right: 8 }}>
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
							cursor={{ fill: "rgba(15, 23, 42, 0.08)" }}
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
							fill="var(--color-total)"
							radius={[4, 4, 0, 0]}
						/>
					</BarChart>
				</ChartContainer>
			</div>

			<div className="mt-6">
				<h3 className="text-sm font-semibold text-slate-900">
					Month-by-month
				</h3>
				<p className="text-xs text-slate-500">
					Totals, transactions, and share of the annual spend.
				</p>
				<div className="mt-3 rounded-md border">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Month</TableHead>
								<TableHead className="text-right">Total</TableHead>
								<TableHead className="text-right">
									Transactions
								</TableHead>
								<TableHead className="text-right">Avg</TableHead>
								<TableHead className="text-right">Share</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{monthlyData.map((month) => (
								<TableRow key={month.month}>
									<TableCell className="font-medium text-slate-700">
										{month.month}
									</TableCell>
									<TableCell className="text-right">
										{formatCurrency(month.total)}
									</TableCell>
									<TableCell className="text-right">
										{month.count}
									</TableCell>
									<TableCell className="text-right">
										{formatCurrency(month.average)}
									</TableCell>
									<TableCell className="text-right">
										{percentFormatter.format(month.share)}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</div>
		</div>
	);
}
