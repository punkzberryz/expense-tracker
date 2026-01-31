import { useMemo } from "react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import type { ExpenseRow } from "@/data/google-sheets";
import { formatCurrency, parseYearDay } from "@/lib/format";
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

const percentFormatter = new Intl.NumberFormat("en-US", {
	style: "percent",
	maximumFractionDigits: 1,
});

type CategoryBreakdownProps = {
	rows: ExpenseRow[];
	year: string;
};

type CategoryDatum = {
	category: string;
	total: number;
	count: number;
	average: number;
	share: number;
};

export function CategoryBreakdown({ rows, year }: CategoryBreakdownProps) {
	const {
		categoryData,
		totalSpend,
		totalTransactions,
		categoriesWithSpend,
		topCategory,
		averageTransaction,
	} = useMemo(() => {
		const categoryTotals = new Map<string, { total: number; count: number }>();
		for (const row of rows) {
			const parsed = parseYearDay(row.date);
			if (!parsed || parsed.year !== year) continue;
			const existing = categoryTotals.get(row.category);
			if (existing) {
				existing.total += row.amount;
				existing.count += 1;
			} else {
				categoryTotals.set(row.category, { total: row.amount, count: 1 });
			}
		}

		const totalSpend = Array.from(categoryTotals.values()).reduce(
			(sum, entry) => sum + entry.total,
			0,
		);
		const totalTransactions = Array.from(categoryTotals.values()).reduce(
			(sum, entry) => sum + entry.count,
			0,
		);
		const categoryData: CategoryDatum[] = Array.from(
			categoryTotals.entries(),
		).map(([category, entry]) => {
			const average = entry.count ? entry.total / entry.count : 0;
			const share = totalSpend ? entry.total / totalSpend : 0;
			return {
				category,
				total: Number(entry.total.toFixed(2)),
				count: entry.count,
				average: Number(average.toFixed(2)),
				share,
			};
		});
		categoryData.sort((a, b) => b.total - a.total);

		return {
			categoryData,
			totalSpend,
			totalTransactions,
			categoriesWithSpend: categoryData.length,
			topCategory: categoryData[0] ?? null,
			averageTransaction: totalTransactions
				? totalSpend / totalTransactions
				: 0,
		};
	}, [rows, year]);

	if (totalSpend <= 0) {
		return (
			<div className="rounded-md border border-slate-200 bg-white p-4">
				<h2 className="text-lg font-semibold text-slate-900">
					Category breakdown
				</h2>
				<p className="mt-2 text-sm text-slate-500">
					No categorized expenses available for this year.
				</p>
			</div>
		);
	}

	const topLabel = topCategory
		? `${topCategory.category} (${formatCurrency(topCategory.total)})`
		: "—";

	return (
		<div className="rounded-md border border-slate-200 bg-white p-4">
			<div className="flex flex-wrap items-start justify-between gap-4">
				<div>
					<h2 className="text-lg font-semibold text-slate-900">
						Category breakdown
					</h2>
					<p className="text-sm text-slate-500">
						Spend totals by category for {year}.
					</p>
				</div>
				<div className="text-right text-sm text-slate-600">
					<div>Total: {formatCurrency(totalSpend)}</div>
					<div>Top category: {topLabel}</div>
				</div>
			</div>

			<div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
				<div className="rounded-md border border-slate-200 bg-white p-3">
					<div className="text-xs text-slate-500">Categories</div>
					<div className="mt-1 text-lg font-semibold text-slate-900">
						{categoriesWithSpend}
					</div>
					<div className="text-xs text-slate-500">Active categories</div>
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
					<div className="text-xs text-slate-500">Top category</div>
					<div className="mt-1 text-lg font-semibold text-slate-900">
						{topCategory?.category ?? "—"}
					</div>
					<div className="text-xs text-slate-500">
						{topCategory ? formatCurrency(topCategory.total) : "—"}
					</div>
				</div>
				<div className="rounded-md border border-slate-200 bg-white p-3">
					<div className="text-xs text-slate-500">Avg per category</div>
					<div className="mt-1 text-lg font-semibold text-slate-900">
						{formatCurrency(
							categoriesWithSpend ? totalSpend / categoriesWithSpend : 0,
						)}
					</div>
					<div className="text-xs text-slate-500">
						Category share of total spend
					</div>
				</div>
			</div>

			<div className="mt-6">
				<ChartContainer
					config={{
						total: { label: "Spend", color: "var(--color-chart-1)" },
					}}
					className="h-72 w-full"
				>
					<BarChart
						data={categoryData}
						layout="vertical"
						margin={{ left: 16, right: 16, top: 4, bottom: 4 }}
					>
						<XAxis
							type="number"
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							tickFormatter={(value) => formatCurrency(Number(value))}
							className="text-xs text-slate-500"
						/>
						<YAxis
							type="category"
							dataKey="category"
							axisLine={false}
							tickLine={false}
							width={120}
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
							radius={[0, 4, 4, 0]}
						/>
					</BarChart>
				</ChartContainer>
			</div>

			<div className="mt-6">
				<h3 className="text-sm font-semibold text-slate-900">
					Category details
				</h3>
				<p className="text-xs text-slate-500">
					Totals, transaction counts, and share of annual spend.
				</p>
				<div className="mt-3 rounded-md border">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Category</TableHead>
								<TableHead className="text-right">Total</TableHead>
								<TableHead className="text-right">Transactions</TableHead>
								<TableHead className="text-right">Avg</TableHead>
								<TableHead className="text-right">Share</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{categoryData.map((category) => (
								<TableRow key={category.category}>
									<TableCell className="font-medium text-slate-700">
										{category.category}
									</TableCell>
									<TableCell className="text-right">
										{formatCurrency(category.total)}
									</TableCell>
									<TableCell className="text-right">{category.count}</TableCell>
									<TableCell className="text-right">
										{formatCurrency(category.average)}
									</TableCell>
									<TableCell className="text-right">
										{percentFormatter.format(category.share)}
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
