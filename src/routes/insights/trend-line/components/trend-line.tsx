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
		peakMonthIndex,
		monthlyChartData,
		dailyChartData,
		dailyRowsByDate,
	} = useTrendLineData(rows, year);

	if (totalSpend <= 0) {
		return (
			<TrendLineEmpty description="No dated expenses available for this year." />
		);
	}

	const peakMonthTotal = monthlyTotals[peakMonthIndex] ?? 0;

	return (
		<div className="rounded-md border border-slate-200 bg-white p-4">
			<TrendLineHeader
				year={year}
				totalSpend={totalSpend}
				peakMonthIndex={peakMonthIndex}
				peakMonthTotal={peakMonthTotal}
			/>
			<TrendLineMonthlyChart monthlyChartData={monthlyChartData} />
			<TrendLineDailySection
				dailyChartData={dailyChartData}
				dailyRowsByDate={dailyRowsByDate}
			/>
		</div>
	);
}
