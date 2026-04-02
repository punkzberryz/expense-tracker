import { useEffect, useMemo, useState } from "react";
import type { ExpenseRow } from "@/data/google-sheets";
import { formatCurrency, formatShortDate } from "@/lib/format";
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

const percentFormatter = new Intl.NumberFormat("en-US", {
	style: "percent",
	maximumFractionDigits: 1,
});

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
	const largestSelectedItem = useMemo(
		() =>
			selectedCategoryItems.reduce<
				(typeof selectedCategoryItems)[number] | null
			>((largest, item) => {
				if (!largest || item.amount > largest.amount) return item;
				return largest;
			}, null),
		[selectedCategoryItems],
	);
	const latestSelectedItem =
		selectedCategoryItems[selectedCategoryItems.length - 1] ?? null;

	if (totalSpend <= 0) {
		return (
			<CategoryBreakdownEmpty description="No categorized expenses available for this year." />
		);
	}

	return (
		<div className="flex flex-col gap-6">
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
			<div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(20rem,0.9fr)]">
				<CategoryBreakdownChart
					categoryData={categoryData}
					selectedCategory={selectedCategory}
				/>
				<section className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm">
					<p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
						Selected category
					</p>
					{selectedCategoryData ? (
						<>
							<h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
								{selectedCategoryData.category}
							</h3>
							<p className="mt-2 text-sm leading-6 text-slate-600">
								{percentFormatter.format(selectedCategoryData.share)} of total
								spend, with {selectedCategoryData.count} purchase
								{selectedCategoryData.count === 1 ? "" : "s"} recorded in {year}
								.
							</p>
							<div className="mt-5 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
								<SelectionMetric
									label="Category total"
									value={formatCurrency(selectedCategoryData.total)}
									description="Combined spend in this category."
								/>
								<SelectionMetric
									label="Average purchase"
									value={formatCurrency(selectedCategoryData.average)}
									description="Average amount per transaction."
								/>
								<SelectionMetric
									label="Largest purchase"
									value={
										largestSelectedItem
											? formatCurrency(largestSelectedItem.amount)
											: formatCurrency(0)
									}
									description={
										largestSelectedItem
											? `${largestSelectedItem.name} on ${formatShortDate(largestSelectedItem.date)}`
											: "No purchases recorded."
									}
								/>
							</div>
							<div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
								<p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
									Latest activity
								</p>
								<p className="mt-2 text-sm font-medium text-slate-900">
									{latestSelectedItem
										? `${latestSelectedItem.name} on ${formatShortDate(latestSelectedItem.date)}`
										: "No purchases recorded"}
								</p>
								<p className="mt-1 text-sm text-slate-600">
									{latestSelectedItem
										? `${formatCurrency(latestSelectedItem.amount)}${
												latestSelectedItem.description
													? ` / ${latestSelectedItem.description}`
													: ""
											}`
										: "Select a category from the table to inspect it in more detail."}
								</p>
							</div>
						</>
					) : (
						<div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
							Select a category from the table to inspect its purchases.
						</div>
					)}
				</section>
			</div>
			<div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
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
				) : (
					<div className="rounded-[26px] border border-dashed border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-sm">
						Select a category to load its purchase timeline.
					</div>
				)}
			</div>
		</div>
	);
}

function SelectionMetric({
	label,
	value,
	description,
}: {
	label: string;
	value: string;
	description: string;
}) {
	return (
		<div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
			<p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
				{label}
			</p>
			<p className="mt-2 text-xl font-semibold tracking-tight text-slate-950">
				{value}
			</p>
			<p className="mt-1 text-sm leading-5 text-slate-600">{description}</p>
		</div>
	);
}
