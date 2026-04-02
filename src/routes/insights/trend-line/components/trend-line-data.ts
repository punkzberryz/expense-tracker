import { useMemo } from "react";
import type { ExpenseRow } from "@/data/google-sheets";
import { parseYearDay, parseYearMonth } from "@/lib/format";

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

export { formatShortDate } from "@/lib/format";

type DailyChartDatum = {
	date: string;
	daily: number;
	cumulative: number;
};

export type TrendLineData = {
	monthlyTotals: number[];
	totalSpend: number;
	monthsWithSpend: number;
	averageActiveMonthSpend: number;
	peakMonthIndex: number;
	monthlyChartData: { month: string; spend: number }[];
	dailyChartData: DailyChartDatum[];
	dailyRowsByDate: Map<string, ExpenseRow[]>;
	highestDailySpend: number;
	highestDailySpendDate: string | null;
	lastActiveDate: string | null;
};

export function getTrendLineData(
	rows: ExpenseRow[],
	year: string,
): TrendLineData {
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
	const monthsWithSpend = monthlyTotals.filter((value) => value > 0).length;
	const averageActiveMonthSpend = monthsWithSpend
		? Number((totalSpend / monthsWithSpend).toFixed(2))
		: 0;
	const peakMonthIndex = totalSpend
		? monthlyTotals.indexOf(Math.max(...monthlyTotals))
		: -1;
	const monthlyChartData = monthlyTotals.map((value, index) => ({
		month: MONTH_LABELS[index],
		spend: Number(value.toFixed(2)),
	}));
	const dailyChartData = Array.from(dailyTotals.entries())
		.sort(([a], [b]) => a.localeCompare(b))
		.reduce<DailyChartDatum[]>((acc, [date, daily]) => {
			const previous = acc[acc.length - 1]?.cumulative ?? 0;
			acc.push({
				date,
				daily: Number(daily.toFixed(2)),
				cumulative: Number((previous + daily).toFixed(2)),
			});
			return acc;
		}, []);
	const highestDailySpendEntry = dailyChartData.reduce<DailyChartDatum | null>(
		(highest, entry) =>
			!highest || entry.daily > highest.daily ? entry : highest,
		null,
	);

	return {
		monthlyTotals,
		totalSpend,
		monthsWithSpend,
		averageActiveMonthSpend,
		peakMonthIndex,
		monthlyChartData,
		dailyChartData,
		dailyRowsByDate,
		highestDailySpend: highestDailySpendEntry?.daily ?? 0,
		highestDailySpendDate: highestDailySpendEntry?.date ?? null,
		lastActiveDate: dailyChartData.at(-1)?.date ?? null,
	};
}

export function useTrendLineData(
	rows: ExpenseRow[],
	year: string,
): TrendLineData {
	return useMemo(() => getTrendLineData(rows, year), [rows, year]);
}
