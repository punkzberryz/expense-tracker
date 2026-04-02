import { useMemo } from "react";
import type { ExpenseRow } from "@/data/google-sheets";
import { parseYearMonth } from "@/lib/format";

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

export type CategoryItemDatum = {
	date: string;
	name: string;
	amount: number;
	description: string;
};

export type CategoryBreakdownData = {
	categoryData: CategoryDatum[];
	totalSpend: number;
	totalTransactions: number;
	categoriesWithSpend: number;
	topCategory: CategoryDatum | null;
	averageTransaction: number;
};

const matchesCategoryScope = (
	row: ExpenseRow,
	year: string,
	monthIndex?: number | null,
) => {
	const parsed = parseYearMonth(row.date);
	if (!parsed || parsed.year !== year) return false;
	if (typeof monthIndex === "number" && parsed.monthIndex !== monthIndex) {
		return false;
	}
	return true;
};

export function getCategoryBreakdownData(
	rows: ExpenseRow[],
	year: string,
	monthIndex?: number | null,
): CategoryBreakdownData {
	const categoryTotals = new Map<string, CategoryTotals>();
	for (const row of rows) {
		if (!matchesCategoryScope(row, year, monthIndex)) continue;
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
		averageTransaction: totalTransactions ? totalSpend / totalTransactions : 0,
	};
}

export function getCategoryItemBreakdownData(
	rows: ExpenseRow[],
	year: string,
	category: string,
	monthIndex?: number | null,
): CategoryItemDatum[] {
	return rows
		.filter(
			(row) =>
				row.category === category &&
				matchesCategoryScope(row, year, monthIndex),
		)
		.map((row) => ({
			date: row.date,
			name: row.name,
			amount: Number(row.amount.toFixed(2)),
			description: row.description,
		}))
		.sort(
			(a, b) =>
				a.date.localeCompare(b.date) ||
				b.amount - a.amount ||
				a.name.localeCompare(b.name),
		);
}

export function getDefaultCategorySelection(categoryData: CategoryDatum[]) {
	return (
		categoryData.find((entry) => entry.category === "Food")?.category ??
		categoryData[0]?.category ??
		null
	);
}

export function useCategoryBreakdownData(
	rows: ExpenseRow[],
	year: string,
	monthIndex?: number | null,
): CategoryBreakdownData {
	return useMemo(
		() => getCategoryBreakdownData(rows, year, monthIndex),
		[rows, year, monthIndex],
	);
}
