import type { ExpenseRow } from "@/data/google-sheets";
import { parseYearMonth } from "@/lib/format";
import { getCategoryBreakdownData } from "@/routes/insights/category-breakdown/components/category-breakdown-data";
import {
	MONTH_LABELS,
	getMonthlySummaryData,
} from "@/routes/insights/monthly-summary/components/monthly-summary-data";
import { getTrendLineData } from "@/routes/insights/trend-line/components/trend-line-data";

export type DashboardData = {
	focusYear: string;
	availableYears: string[];
	totalSpend: number;
	totalTransactions: number;
	averageTransaction: number;
	monthsWithSpend: number;
	activeDays: number;
	currentMonthLabel: string | null;
	currentMonthSpend: number;
	previousMonthLabel: string | null;
	previousMonthSpend: number;
	monthOverMonthChange: number | null;
	peakMonthLabel: string | null;
	peakMonthSpend: number;
	topCategory: string | null;
	topCategorySpend: number;
	topCategoryShare: number;
	topCategories: {
		category: string;
		total: number;
		count: number;
		share: number;
	}[];
	largestExpense: ExpenseRow | null;
	recentTransactions: ExpenseRow[];
	monthlyChartData: { month: string; spend: number }[];
};

const getLatestActiveMonthIndex = (
	monthlyData: { total: number }[],
	fromIndex = monthlyData.length - 1,
) => {
	for (let index = fromIndex; index >= 0; index -= 1) {
		if (monthlyData[index]?.total > 0) {
			return index;
		}
	}

	return -1;
};

export function buildDashboardData(
	rows: ExpenseRow[],
	focusYear: string,
	availableYears: string[],
): DashboardData {
	const yearRows = rows
		.filter((row) => parseYearMonth(row.date)?.year === focusYear)
		.sort((left, right) => {
			if (left.date === right.date) {
				return right.amount - left.amount;
			}
			return right.date.localeCompare(left.date);
		});
	const trendLine = getTrendLineData(yearRows, focusYear);
	const monthlySummary = getMonthlySummaryData(yearRows, focusYear);
	const categoryBreakdown = getCategoryBreakdownData(yearRows, focusYear);
	const latestMonthIndex = getLatestActiveMonthIndex(
		monthlySummary.monthlyData,
	);
	const previousMonthIndex = getLatestActiveMonthIndex(
		monthlySummary.monthlyData,
		latestMonthIndex - 1,
	);
	const currentMonth = monthlySummary.monthlyData[latestMonthIndex];
	const previousMonth = monthlySummary.monthlyData[previousMonthIndex];
	const largestExpense = yearRows.reduce<ExpenseRow | null>((largest, row) => {
		if (!largest || row.amount > largest.amount) {
			return row;
		}

		return largest;
	}, null);
	const peakMonthSpend =
		monthlySummary.peakMonthIndex >= 0
			? (monthlySummary.monthlyData[monthlySummary.peakMonthIndex]?.total ?? 0)
			: 0;
	const monthOverMonthChange =
		currentMonth && previousMonth && previousMonth.total > 0
			? ((currentMonth.total - previousMonth.total) / previousMonth.total) * 100
			: null;

	return {
		focusYear,
		availableYears,
		totalSpend: monthlySummary.totalSpend,
		totalTransactions: monthlySummary.totalTransactions,
		averageTransaction: monthlySummary.averageTransaction,
		monthsWithSpend: monthlySummary.monthsWithSpend,
		activeDays: trendLine.dailyChartData.length,
		currentMonthLabel:
			latestMonthIndex >= 0 ? MONTH_LABELS[latestMonthIndex] : null,
		currentMonthSpend: currentMonth?.total ?? 0,
		previousMonthLabel:
			previousMonthIndex >= 0 ? MONTH_LABELS[previousMonthIndex] : null,
		previousMonthSpend: previousMonth?.total ?? 0,
		monthOverMonthChange,
		peakMonthLabel:
			monthlySummary.peakMonthIndex >= 0
				? MONTH_LABELS[monthlySummary.peakMonthIndex]
				: null,
		peakMonthSpend,
		topCategory: categoryBreakdown.topCategory?.category ?? null,
		topCategorySpend: categoryBreakdown.topCategory?.total ?? 0,
		topCategoryShare: categoryBreakdown.topCategory?.share ?? 0,
		topCategories: categoryBreakdown.categoryData.slice(0, 5),
		largestExpense,
		recentTransactions: yearRows.slice(0, 6),
		monthlyChartData: trendLine.monthlyChartData,
	};
}
