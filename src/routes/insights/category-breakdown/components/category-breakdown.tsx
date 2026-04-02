import { useEffect, useMemo, useState } from "react";
import type { ExpenseRow } from "@/data/google-sheets";
import { CategoryBreakdownChart } from "./category-breakdown-chart";
import {
	getCategoryItemBreakdownData,
	getDefaultCategorySelection,
	useCategoryBreakdownData,
} from "./category-breakdown-data";
import { CategoryBreakdownDetailChart } from "./category-breakdown-detail-chart";
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
	const [selectedCategory, setSelectedCategory] = useState<string | null>(() =>
		getDefaultCategorySelection(categoryData),
	);

	useEffect(() => {
		if (selectedCategory) {
			const hasSelection = categoryData.some(
				(entry) => entry.category === selectedCategory,
			);
			if (hasSelection) return;
		}
		setSelectedCategory(getDefaultCategorySelection(categoryData));
	}, [categoryData, selectedCategory]);

	const selectedCategoryData = useMemo(
		() =>
			categoryData.find((entry) => entry.category === selectedCategory) ?? null,
		[categoryData, selectedCategory],
	);
	const selectedCategoryItems = useMemo(
		() =>
			selectedCategory
				? getCategoryItemBreakdownData(rows, year, selectedCategory)
				: [],
		[rows, year, selectedCategory],
	);

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
			<CategoryBreakdownTable
				categoryData={categoryData}
				selectedCategory={selectedCategory}
				onSelectCategory={setSelectedCategory}
			/>
			{selectedCategoryData ? (
				<CategoryBreakdownDetailChart
					category={selectedCategoryData}
					itemData={selectedCategoryItems}
				/>
			) : null}
		</div>
	);
}
