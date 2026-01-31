import { formatCurrency } from "@/lib/format";
import { MONTH_LABELS } from "./monthly-summary-data";

type MonthlySummaryHeaderProps = {
	year: string;
	totalSpend: number;
	peakMonthIndex: number;
	peakMonthTotal: number;
};

export function MonthlySummaryHeader({
	year,
	totalSpend,
	peakMonthIndex,
	peakMonthTotal,
}: MonthlySummaryHeaderProps) {
	const peakLabel =
		peakMonthIndex >= 0
			? `${MONTH_LABELS[peakMonthIndex]} (${formatCurrency(peakMonthTotal)})`
			: "—";

	return (
		<div className="flex flex-wrap items-start justify-between gap-4">
			<div>
				<h2 className="text-lg font-semibold text-slate-900">
					Monthly summary
				</h2>
				<p className="text-sm text-slate-500">Monthly totals for {year}.</p>
			</div>
			<div className="text-right text-sm text-slate-600">
				<div>Total: {formatCurrency(totalSpend)}</div>
				<div>Peak month: {peakLabel}</div>
			</div>
		</div>
	);
}
