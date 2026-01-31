import { formatCurrency } from "@/lib/format";
import type { CategoryDatum } from "./category-breakdown-data";

type CategoryBreakdownHeaderProps = {
	year: string;
	totalSpend: number;
	topCategory: CategoryDatum | null;
};

export function CategoryBreakdownHeader({
	year,
	totalSpend,
	topCategory,
}: CategoryBreakdownHeaderProps) {
	const topLabel = topCategory
		? `${topCategory.category} (${formatCurrency(topCategory.total)})`
		: "—";

	return (
		<div className="flex flex-wrap items-start justify-between gap-4">
			<div>
				<h2 className="text-lg font-semibold text-slate-900">
					Category breakdown
				</h2>
				<p className="text-sm text-slate-500">
					Spend totals by category for {year}.
				</p>
			</div>
			<div className="text-right text-sm text-slate-600">
				<div>Total: {formatCurrency(totalSpend)}</div>
				<div>Top category: {topLabel}</div>
			</div>
		</div>
	);
}
