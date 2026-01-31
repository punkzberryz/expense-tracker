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
	return (
		<div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
			<div className="rounded-md border border-slate-200 bg-white p-3">
				<div className="text-xs text-slate-500">Avg monthly spend</div>
				<div className="mt-1 text-lg font-semibold text-slate-900">
					{formatCurrency(averageMonthlySpend)}
				</div>
				<div className="text-xs text-slate-500">
					{monthsWithSpend} active months
				</div>
			</div>
			<div className="rounded-md border border-slate-200 bg-white p-3">
				<div className="text-xs text-slate-500">Transactions</div>
				<div className="mt-1 text-lg font-semibold text-slate-900">
					{totalTransactions}
				</div>
				<div className="text-xs text-slate-500">
					Avg {formatCurrency(averageTransaction)} per purchase
				</div>
			</div>
			<div className="rounded-md border border-slate-200 bg-white p-3">
				<div className="text-xs text-slate-500">Highest month</div>
				<div className="mt-1 text-lg font-semibold text-slate-900">
					{peakMonthIndex >= 0 ? MONTH_LABELS[peakMonthIndex] : "—"}
				</div>
				<div className="text-xs text-slate-500">
					{peakMonthIndex >= 0 ? formatCurrency(peakMonthTotal) : "—"}
				</div>
			</div>
			<div className="rounded-md border border-slate-200 bg-white p-3">
				<div className="text-xs text-slate-500">Active months</div>
				<div className="mt-1 text-lg font-semibold text-slate-900">
					{monthsWithSpend} / 12
				</div>
				<div className="text-xs text-slate-500">Months with spend</div>
			</div>
		</div>
	);
}
