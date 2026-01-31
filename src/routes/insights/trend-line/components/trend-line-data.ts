import { useMemo } from "react";
import type { ExpenseRow } from "@/data/google-sheets";

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

export const formatShortDate = (value: string) => {
	if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
	const [, month, day] = value.split("-");
	const monthIndex = Number(month) - 1;
	const label = MONTH_LABELS[monthIndex] ?? month;
	return `${label} ${Number(day)}`;
};

type DailyChartDatum = {
	date: string;
	daily: number;
	cumulative: number;
};

export type TrendLineData = {
	monthlyTotals: number[];
	totalSpend: number;
	peakMonthIndex: number;
	monthlyChartData: { month: string; spend: number }[];
	dailyChartData: DailyChartDatum[];
	dailyRowsByDate: Map<string, ExpenseRow[]>;
};

export function useTrendLineData(
	rows: ExpenseRow[],
	year: string,
): TrendLineData {
	return useMemo(() => {
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
			.reduce<DailyChartDatum[]>((acc, [date, daily]) => {
				const previous = acc[acc.length - 1]?.cumulative ?? 0;
				acc.push({
					date,
					daily: Number(daily.toFixed(2)),
					cumulative: Number((previous + daily).toFixed(2)),
				});
				return acc;
			}, []);
		return {
			monthlyTotals,
			totalSpend,
			peakMonthIndex,
			monthlyChartData,
			dailyChartData,
			dailyRowsByDate,
		};
	}, [rows, year]);
}
