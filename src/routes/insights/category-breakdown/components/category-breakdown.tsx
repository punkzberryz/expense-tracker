import type { ExpenseRow } from "@/data/google-sheets";
import { CategoryBreakdownChart } from "./category-breakdown-chart";
import { useCategoryBreakdownData } from "./category-breakdown-data";
import { CategoryBreakdownEmpty } from "./category-breakdown-empty";
import { CategoryBreakdownHeader } from "./category-breakdown-header";
import { CategoryBreakdownStats } from "./category-breakdown-stats";
import { CategoryBreakdownTable } from "./category-breakdown-table";

type CategoryBreakdownProps = {
	rows: ExpenseRow[];
	year: string;
};

export function CategoryBreakdown({ rows, year }: CategoryBreakdownProps) {
	const {
		categoryData,
		totalSpend,
		totalTransactions,
		categoriesWithSpend,
		topCategory,
		averageTransaction,
	} = useCategoryBreakdownData(rows, year);

	if (totalSpend <= 0) {
		return (
			<CategoryBreakdownEmpty description="No categorized expenses available for this year." />
		);
	}

	return (
		<div className="rounded-md border border-slate-200 bg-white p-4">
			<CategoryBreakdownHeader
				year={year}
				totalSpend={totalSpend}
				topCategory={topCategory}
			/>
			<CategoryBreakdownStats
				totalSpend={totalSpend}
				totalTransactions={totalTransactions}
				categoriesWithSpend={categoriesWithSpend}
				topCategory={topCategory}
				averageTransaction={averageTransaction}
			/>
			<CategoryBreakdownChart categoryData={categoryData} />
			<CategoryBreakdownTable categoryData={categoryData} />
		</div>
	);
}
