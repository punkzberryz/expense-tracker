import { formatCurrency } from "@/lib/format";
import type { CategoryDatum } from "./category-breakdown-data";

const percentFormatter = new Intl.NumberFormat("en-US", {
	style: "percent",
	maximumFractionDigits: 1,
});

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
		<div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
			<StatCard
				label="Active categories"
				value={String(categoriesWithSpend)}
				description="Categories with recorded spend this year."
			/>
			<StatCard
				label="Transactions"
				value={String(totalTransactions)}
				description={`Average purchase ${formatCurrency(averageTransaction)}.`}
			/>
			<StatCard
				label="Leading category"
				value={topCategory?.category ?? "No data"}
				description={
					topCategory
						? `${formatCurrency(topCategory.total)} / ${percentFormatter.format(topCategory.share)} of spend.`
						: "No category totals available yet."
				}
			/>
			<StatCard
				label="Average per category"
				value={formatCurrency(
					categoriesWithSpend ? totalSpend / categoriesWithSpend : 0,
				)}
				description="Typical spend allocated to each active category."
			/>
		</div>
	);
}

function StatCard({
	label,
	value,
	description,
}: {
	label: string;
	value: string;
	description: string;
}) {
	return (
		<div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
			<p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
				{label}
			</p>
			<p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
				{value}
			</p>
			<p className="mt-2 text-sm leading-5 text-slate-600">{description}</p>
		</div>
	);
}
