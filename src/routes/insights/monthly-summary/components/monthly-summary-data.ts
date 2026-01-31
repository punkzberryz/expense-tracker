import { useMemo } from "react";
import type { ExpenseRow } from "@/data/google-sheets";
import { parseYearMonth } from "@/lib/format";

export const MONTH_LABELS = [
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

export type MonthlyDatum = {
	month: string;
	total: number;
	count: number;
	average: number;
	share: number;
};

export type MonthlySummaryData = {
	monthlyData: MonthlyDatum[];
	totalSpend: number;
	monthsWithSpend: number;
	totalTransactions: number;
	peakMonthIndex: number;
	averageMonthlySpend: number;
	averageTransaction: number;
};

export function useMonthlySummaryData(
	rows: ExpenseRow[],
	year: string,
): MonthlySummaryData {
	return useMemo(() => {
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
}
