import { useMemo } from "react";
import type { ExpenseRow } from "@/data/google-sheets";
import { parseYearMonth } from "@/lib/format";
import {
	getCategoryBreakdownData,
	type CategoryDatum,
} from "@/routes/insights/category-breakdown/components/category-breakdown-data";

export type MonthlySummaryMonthDetailData = {
	monthRows: ExpenseRow[];
	totalSpend: number;
	totalTransactions: number;
	activeDays: number;
	averageTransaction: number;
	averageDailySpend: number;
	shareOfYear: number;
	topCategory: CategoryDatum | null;
	largestExpense: ExpenseRow | null;
	latestExpense: ExpenseRow | null;
};

export function getMonthlySummaryMonthDetailData(
	rows: ExpenseRow[],
	year: string,
	monthIndex: number,
): MonthlySummaryMonthDetailData {
	if (!Number.isInteger(monthIndex) || monthIndex < 0 || monthIndex > 11) {
		return {
			monthRows: [],
			totalSpend: 0,
			totalTransactions: 0,
			activeDays: 0,
			averageTransaction: 0,
			averageDailySpend: 0,
			shareOfYear: 0,
			topCategory: null,
			largestExpense: null,
			latestExpense: null,
		};
	}

	const monthRows = rows.filter((row) => {
		const parsed = parseYearMonth(row.date);
		return Boolean(
			parsed && parsed.year === year && parsed.monthIndex === monthIndex,
		);
	});

	const totalSpend = monthRows.reduce((sum, row) => sum + row.amount, 0);
	const totalTransactions = monthRows.length;
	const activeDays = new Set(monthRows.map((row) => row.date)).size;
	const averageTransaction = totalTransactions ? totalSpend / totalTransactions : 0;
	const averageDailySpend = activeDays ? totalSpend / activeDays : 0;
	const yearTotalSpend = rows.reduce((sum, row) => {
		const parsed = parseYearMonth(row.date);
		if (!parsed || parsed.year !== year) return sum;
		return sum + row.amount;
	}, 0);
	const shareOfYear = yearTotalSpend ? totalSpend / yearTotalSpend : 0;
	const { topCategory } = getCategoryBreakdownData(rows, year, monthIndex);
	const largestExpense = monthRows.reduce<ExpenseRow | null>((largest, row) => {
		if (!largest || row.amount > largest.amount) return row;
		return largest;
	}, null);
	const latestExpense = monthRows.reduce<ExpenseRow | null>((latest, row) => {
		if (!latest) return row;
		if (row.date > latest.date) return row;
		if (row.date === latest.date && row.amount > latest.amount) return row;
		return latest;
	}, null);

	return {
		monthRows,
		totalSpend,
		totalTransactions,
		activeDays,
		averageTransaction,
		averageDailySpend,
		shareOfYear,
		topCategory,
		largestExpense,
		latestExpense,
	};
}

export function useMonthlySummaryMonthDetailData(
	rows: ExpenseRow[],
	year: string,
	monthIndex: number,
) {
	return useMemo(
		() => getMonthlySummaryMonthDetailData(rows, year, monthIndex),
		[rows, year, monthIndex],
	);
}
