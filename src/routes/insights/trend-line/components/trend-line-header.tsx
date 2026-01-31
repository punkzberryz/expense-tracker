import { formatCurrency } from "@/lib/format";
import { MONTH_LABELS } from "./trend-line-data";

type TrendLineHeaderProps = {
	year: string;
	totalSpend: number;
	peakMonthIndex: number;
	peakMonthTotal: number;
};

export function TrendLineHeader({
	year,
	totalSpend,
	peakMonthIndex,
	peakMonthTotal,
}: TrendLineHeaderProps) {
	const peakLabel =
		peakMonthIndex >= 0
			? `${MONTH_LABELS[peakMonthIndex]} (${formatCurrency(peakMonthTotal)})`
			: "—";

	return (
		<div className="flex flex-wrap items-start justify-between gap-4">
			<div>
				<h2 className="text-lg font-semibold text-slate-900">Trend line</h2>
				<p className="text-sm text-slate-500">Monthly spend across {year}.</p>
			</div>
			<div className="text-right text-sm text-slate-600">
				<div>Total: {formatCurrency(totalSpend)}</div>
				<div>Peak month: {peakLabel}</div>
			</div>
		</div>
	);
}
