import { useMemo } from "react";
import type { ExpenseRow } from "@/data/google-sheets";
import { parseYearDay } from "@/lib/format";

type CategoryTotals = {
	total: number;
	count: number;
};

export type CategoryDatum = {
	category: string;
	total: number;
	count: number;
	average: number;
	share: number;
};

export type CategoryBreakdownData = {
	categoryData: CategoryDatum[];
	totalSpend: number;
	totalTransactions: number;
	categoriesWithSpend: number;
	topCategory: CategoryDatum | null;
	averageTransaction: number;
};

export function useCategoryBreakdownData(
	rows: ExpenseRow[],
	year: string,
): CategoryBreakdownData {
	return useMemo(() => {
		const categoryTotals = new Map<string, CategoryTotals>();
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
}
