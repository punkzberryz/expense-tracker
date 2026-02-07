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
		<div className="rounded-md border border-slate-200 bg-white p-4">
			<MonthlySummaryHeader
				year={year}
				totalSpend={totalSpend}
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
			<MonthlySummaryChart monthlyData={monthlyData} />
			<MonthlySummaryPieChart rows={rows} year={year} />
			<MonthlySummaryTable monthlyData={monthlyData} />
		</div>
	);
}
