import type { ExpenseRow } from "@/data/google-sheets";
import { MonthlySummaryChart } from "./monthly-summary-chart";
import { useMonthlySummaryData } from "./monthly-summary-data";
import { MonthlySummaryEmpty } from "./monthly-summary-empty";
import { MonthlySummaryHeader } from "./monthly-summary-header";
import { MonthlySummaryPieChart } from "./monthly-summary-pie-chart";
import { MonthlySummaryStats } from "./monthly-summary-stats";
import { MonthlySummaryTable } from "./monthly-summary-table";

type MonthlySummaryProps = {
	rows: ExpenseRow[];
	year: string;
};

export function MonthlySummary({ rows, year }: MonthlySummaryProps) {
	const {
		monthlyData,
		totalSpend,
		monthsWithSpend,
		totalTransactions,
		peakMonthIndex,
		averageMonthlySpend,
		averageTransaction,
	} = useMonthlySummaryData(rows, year);

	if (totalSpend <= 0) {
		return (
			<MonthlySummaryEmpty description="No dated expenses available for this year." />
		);
	}

	const peakMonthTotal = monthlyData[peakMonthIndex]?.total ?? 0;

	return (
		<div className="space-y-6">
			<MonthlySummaryHeader
				year={year}
				totalSpend={totalSpend}
				monthsWithSpend={monthsWithSpend}
				averageMonthlySpend={averageMonthlySpend}
				peakMonthIndex={peakMonthIndex}
				peakMonthTotal={peakMonthTotal}
			/>
			<MonthlySummaryStats
				averageMonthlySpend={averageMonthlySpend}
				monthsWithSpend={monthsWithSpend}
				totalTransactions={totalTransactions}
				averageTransaction={averageTransaction}
				peakMonthIndex={peakMonthIndex}
				peakMonthTotal={peakMonthTotal}
			/>
			<div className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.95fr)]">
				<MonthlySummaryChart
					monthlyData={monthlyData}
					totalSpend={totalSpend}
				/>
				<MonthlySummaryPieChart rows={rows} year={year} />
			</div>
			<MonthlySummaryTable
				monthlyData={monthlyData}
				year={year}
				peakMonthIndex={peakMonthIndex}
			/>
		</div>
	);
}
