import { formatCurrency } from "@/lib/format";
import type { CategoryDatum } from "./category-breakdown-data";

type CategoryBreakdownStatsProps = {
	totalSpend: number;
	totalTransactions: number;
	categoriesWithSpend: number;
	topCategory: CategoryDatum | null;
	averageTransaction: number;
};

export function CategoryBreakdownStats({
	totalSpend,
	totalTransactions,
	categoriesWithSpend,
	topCategory,
	averageTransaction,
}: CategoryBreakdownStatsProps) {
	return (
		<div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
			<div className="rounded-md border border-slate-200 bg-white p-3">
				<div className="text-xs text-slate-500">Categories</div>
				<div className="mt-1 text-lg font-semibold text-slate-900">
					{categoriesWithSpend}
				</div>
				<div className="text-xs text-slate-500">Active categories</div>
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
				<div className="text-xs text-slate-500">Top category</div>
				<div className="mt-1 text-lg font-semibold text-slate-900">
					{topCategory?.category ?? "—"}
				</div>
				<div className="text-xs text-slate-500">
					{topCategory ? formatCurrency(topCategory.total) : "—"}
				</div>
			</div>
			<div className="rounded-md border border-slate-200 bg-white p-3">
				<div className="text-xs text-slate-500">Avg per category</div>
				<div className="mt-1 text-lg font-semibold text-slate-900">
					{formatCurrency(
						categoriesWithSpend ? totalSpend / categoriesWithSpend : 0,
					)}
				</div>
				<div className="text-xs text-slate-500">
					Category share of total spend
				</div>
			</div>
		</div>
	);
}
