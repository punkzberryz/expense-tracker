import type { ExpenseRow } from "@/data/google-sheets";
import { TrendLineDailySection } from "./trend-line-daily-section";
import { TrendLineEmpty } from "./trend-line-empty";
import { TrendLineHeader } from "./trend-line-header";
import { TrendLineMonthlyChart } from "./trend-line-monthly-chart";
import { useTrendLineData } from "./trend-line-data";

type TrendLineProps = {
	rows: ExpenseRow[];
	year: string;
};

export function TrendLine({ rows, year }: TrendLineProps) {
	const {
		monthlyTotals,
		totalSpend,
		monthsWithSpend,
		averageActiveMonthSpend,
		peakMonthIndex,
		monthlyChartData,
		dailyChartData,
		dailyRowsByDate,
		highestDailySpend,
		highestDailySpendDate,
		lastActiveDate,
	} = useTrendLineData(rows, year);

	if (totalSpend <= 0) {
		return (
			<TrendLineEmpty description="No dated expenses are available for this year yet." />
		);
	}

	const peakMonthTotal = monthlyTotals[peakMonthIndex] ?? 0;

	return (
		<div className="space-y-6">
			<TrendLineHeader
				year={year}
				totalSpend={totalSpend}
				monthsWithSpend={monthsWithSpend}
				averageActiveMonthSpend={averageActiveMonthSpend}
				peakMonthIndex={peakMonthIndex}
				peakMonthTotal={peakMonthTotal}
				highestDailySpend={highestDailySpend}
				highestDailySpendDate={highestDailySpendDate}
			/>
			<TrendLineMonthlyChart
				monthlyChartData={monthlyChartData}
				averageActiveMonthSpend={averageActiveMonthSpend}
				monthsWithSpend={monthsWithSpend}
				lastActiveDate={lastActiveDate}
			/>
			<TrendLineDailySection
				dailyChartData={dailyChartData}
				dailyRowsByDate={dailyRowsByDate}
				lastActiveDate={lastActiveDate}
			/>
		</div>
	);
}
