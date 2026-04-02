import { formatCurrency } from "@/lib/format";
import { MONTH_LABELS } from "./monthly-summary-data";

type MonthlySummaryStatsProps = {
	averageMonthlySpend: number;
	monthsWithSpend: number;
	totalTransactions: number;
	averageTransaction: number;
	peakMonthIndex: number;
	peakMonthTotal: number;
};

export function MonthlySummaryStats({
	averageMonthlySpend,
	monthsWithSpend,
	totalTransactions,
	averageTransaction,
	peakMonthIndex,
	peakMonthTotal,
}: MonthlySummaryStatsProps) {
	const quietMonths = 12 - monthsWithSpend;

	return (
		<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
			<div className="rounded-[24px] border border-emerald-200 bg-emerald-50/70 p-4 shadow-sm">
				<div className="text-xs font-medium uppercase tracking-[0.16em] text-emerald-700">
					Active-month average
				</div>
				<div className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
					{formatCurrency(averageMonthlySpend)}
				</div>
				<div className="mt-2 text-sm text-slate-600">
					Spread across {monthsWithSpend} active month
					{monthsWithSpend === 1 ? "" : "s"}.
				</div>
			</div>
			<div className="rounded-[24px] border border-sky-200 bg-sky-50/70 p-4 shadow-sm">
				<div className="text-xs font-medium uppercase tracking-[0.16em] text-sky-700">
					Transactions
				</div>
				<div className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
					{totalTransactions}
				</div>
				<div className="mt-2 text-sm text-slate-600">
					Average {formatCurrency(averageTransaction)} per purchase.
				</div>
			</div>
			<div className="rounded-[24px] border border-amber-200 bg-amber-50/80 p-4 shadow-sm">
				<div className="text-xs font-medium uppercase tracking-[0.16em] text-amber-700">
					Highest month
				</div>
				<div className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
					{peakMonthIndex >= 0 ? MONTH_LABELS[peakMonthIndex] : "No data"}
				</div>
				<div className="mt-2 text-sm text-slate-600">
					{peakMonthIndex >= 0
						? `${formatCurrency(peakMonthTotal)} recorded in the busiest month.`
						: "A peak month will appear once there is data."}
				</div>
			</div>
			<div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
				<div className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
					Quiet months
				</div>
				<div className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
					{quietMonths}
				</div>
				<div className="mt-2 text-sm text-slate-600">
					Months with no dated spend out of the full 12-month view.
				</div>
			</div>
		</div>
	);
}
