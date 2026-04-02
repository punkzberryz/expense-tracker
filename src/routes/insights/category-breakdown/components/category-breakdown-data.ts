import { endOfWeek, format, isValid, parseISO, startOfWeek } from "date-fns";
import { useMemo } from "react";
import type { ExpenseRow } from "@/data/google-sheets";
import { parseYearMonth } from "@/lib/format";

type CategoryTotals = {
	total: number;
	count: number;
};

export type CategoryDatum = {
	category: string;
	total: number;
	count: number;
	average: number;
	share: number;
};

export type CategoryItemDatum = {
	date: string;
	name: string;
	amount: number;
	description: string;
};

export type CategoryItemHighlightLevel = "normal" | "high" | "very-high";

export type HighlightedCategoryItemDatum = CategoryItemDatum & {
	highlightLevel: CategoryItemHighlightLevel;
};

export type CategoryItemGrouping = "day" | "week" | "month";

export type GroupedCategoryItemDatum = {
	bucketKey: string;
	label: string;
	date: string;
	amount: number;
	count: number;
	name: string;
	description: string;
	items: CategoryItemDatum[];
};

export type CategoryBreakdownData = {
	categoryData: CategoryDatum[];
	totalSpend: number;
	totalTransactions: number;
	categoriesWithSpend: number;
	topCategory: CategoryDatum | null;
	averageTransaction: number;
};

const matchesCategoryScope = (
	row: ExpenseRow,
	year: string,
	monthIndex?: number | null,
) => {
	const parsed = parseYearMonth(row.date);
	if (!parsed || parsed.year !== year) return false;
	if (typeof monthIndex === "number" && parsed.monthIndex !== monthIndex) {
		return false;
	}
	return true;
};

export function getCategoryBreakdownData(
	rows: ExpenseRow[],
	year: string,
	monthIndex?: number | null,
): CategoryBreakdownData {
	const categoryTotals = new Map<string, CategoryTotals>();
	for (const row of rows) {
		if (!matchesCategoryScope(row, year, monthIndex)) continue;
		const existing = categoryTotals.get(row.category);
		if (existing) {
			existing.total += row.amount;
			existing.count += 1;
		} else {
			categoryTotals.set(row.category, { total: row.amount, count: 1 });
		}
	}

	const totalSpend = Array.from(categoryTotals.values()).reduce(
		(sum, entry) => sum + entry.total,
		0,
	);
	const totalTransactions = Array.from(categoryTotals.values()).reduce(
		(sum, entry) => sum + entry.count,
		0,
	);
	const categoryData: CategoryDatum[] = Array.from(
		categoryTotals.entries(),
	).map(([category, entry]) => {
		const average = entry.count ? entry.total / entry.count : 0;
		const share = totalSpend ? entry.total / totalSpend : 0;
		return {
			category,
			total: Number(entry.total.toFixed(2)),
			count: entry.count,
			average: Number(average.toFixed(2)),
			share,
		};
	});
	categoryData.sort((a, b) => b.total - a.total);

	return {
		categoryData,
		totalSpend,
		totalTransactions,
		categoriesWithSpend: categoryData.length,
		topCategory: categoryData[0] ?? null,
		averageTransaction: totalTransactions ? totalSpend / totalTransactions : 0,
	};
}

export function getCategoryItemBreakdownData(
	rows: ExpenseRow[],
	year: string,
	category: string,
	monthIndex?: number | null,
): CategoryItemDatum[] {
	return rows
		.filter(
			(row) =>
				row.category === category &&
				matchesCategoryScope(row, year, monthIndex),
		)
		.map((row) => ({
			date: row.date,
			name: row.name,
			amount: Number(row.amount.toFixed(2)),
			description: row.description,
		}))
		.sort(
			(a, b) =>
				a.date.localeCompare(b.date) ||
				b.amount - a.amount ||
				a.name.localeCompare(b.name),
		);
}

function getQuantile(sortedValues: number[], quantile: number) {
	if (sortedValues.length === 0) return 0;
	if (sortedValues.length === 1) return sortedValues[0] ?? 0;

	const index = (sortedValues.length - 1) * quantile;
	const lowerIndex = Math.floor(index);
	const upperIndex = Math.ceil(index);
	const lowerValue = sortedValues[lowerIndex] ?? 0;
	const upperValue = sortedValues[upperIndex] ?? lowerValue;

	if (lowerIndex === upperIndex) return lowerValue;

	return lowerValue + (upperValue - lowerValue) * (index - lowerIndex);
}

export function getHighlightedCategoryItemData(
	itemData: CategoryItemDatum[],
): HighlightedCategoryItemDatum[] {
	if (itemData.length === 0) return [];

	const sortedAmounts = itemData
		.map((item) => item.amount)
		.sort((a, b) => a - b);
	const median = getQuantile(sortedAmounts, 0.5);
	const highestAmount = sortedAmounts[sortedAmounts.length - 1] ?? 0;

	if (itemData.length < 6) {
		const shouldHighlightLargest = highestAmount >= median * 1.75;

		return itemData.map((item) => ({
			...item,
			highlightLevel:
				shouldHighlightLargest && item.amount === highestAmount
					? "very-high"
					: "normal",
		}));
	}

	const highThreshold = Math.max(
		getQuantile(sortedAmounts, 0.75),
		median * 1.3,
	);
	const veryHighThreshold = Math.max(
		getQuantile(sortedAmounts, 0.9),
		median * 1.75,
	);

	return itemData.map((item) => ({
		...item,
		highlightLevel:
			item.amount >= veryHighThreshold
				? "very-high"
				: item.amount >= highThreshold
					? "high"
					: "normal",
	}));
}

export function getGroupedCategoryItemData(
	itemData: CategoryItemDatum[],
	grouping: CategoryItemGrouping,
): GroupedCategoryItemDatum[] {
	if (grouping === "day") {
		const dailyGroups = new Map<string, CategoryItemDatum[]>();
		for (const item of itemData) {
			const existing = dailyGroups.get(item.date);
			if (existing) {
				existing.push(item);
			} else {
				dailyGroups.set(item.date, [item]);
			}
		}

		return Array.from(dailyGroups.entries())
			.map(([date, items]) =>
				buildGroupedCategoryItem(date, date, items, grouping),
			)
			.sort((a, b) => a.date.localeCompare(b.date));
	}

	const groupedItems = new Map<string, CategoryItemDatum[]>();
	for (const item of itemData) {
		const parsedDate = parseISO(item.date);
		if (!isValid(parsedDate)) continue;

		if (grouping === "week") {
			const weekStart = startOfWeek(parsedDate, { weekStartsOn: 1 });
			const weekKey = format(weekStart, "yyyy-MM-dd");
			const existing = groupedItems.get(weekKey);
			if (existing) {
				existing.push(item);
			} else {
				groupedItems.set(weekKey, [item]);
			}
			continue;
		}

		const monthKey = format(parsedDate, "yyyy-MM");
		const existing = groupedItems.get(monthKey);
		if (existing) {
			existing.push(item);
		} else {
			groupedItems.set(monthKey, [item]);
		}
	}

	return Array.from(groupedItems.entries())
		.map(([bucketKey, items]) =>
			buildGroupedCategoryItem(
				bucketKey,
				grouping === "month" ? `${bucketKey}-01` : bucketKey,
				items,
				grouping,
			),
		)
		.sort((a, b) => a.date.localeCompare(b.date));
}

function buildGroupedCategoryItem(
	bucketKey: string,
	date: string,
	items: CategoryItemDatum[],
	grouping: CategoryItemGrouping,
): GroupedCategoryItemDatum {
	const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);
	const largestItem = items.reduce<CategoryItemDatum | null>(
		(largest, item) => {
			if (!largest || item.amount > largest.amount) return item;
			return largest;
		},
		null,
	);

	return {
		bucketKey,
		label: getGroupedCategoryLabel(bucketKey, grouping),
		date,
		amount: Number(totalAmount.toFixed(2)),
		count: items.length,
		name:
			items.length === 1
				? (items[0]?.name ?? "")
				: `${items.length} purchases in ${getGroupingNoun(grouping)}`,
		description:
			items.length === 1
				? (items[0]?.description ?? "")
				: largestItem
					? `Largest purchase: ${largestItem.name}`
					: "",
		items,
	};
}

function getGroupedCategoryLabel(
	bucketKey: string,
	grouping: CategoryItemGrouping,
) {
	if (grouping === "day") return bucketKey;

	if (grouping === "week") {
		const parsedDate = parseISO(bucketKey);
		if (!isValid(parsedDate)) return bucketKey;
		const weekEnd = endOfWeek(parsedDate, { weekStartsOn: 1 });
		return `${format(parsedDate, "MMM d")} - ${format(weekEnd, "MMM d")}`;
	}

	const parsedMonth = parseISO(`${bucketKey}-01`);
	if (!isValid(parsedMonth)) return bucketKey;
	return format(parsedMonth, "MMM yyyy");
}

function getGroupingNoun(grouping: CategoryItemGrouping) {
	switch (grouping) {
		case "week":
			return "week";
		case "month":
			return "month";
		default:
			return "day";
	}
}

export function getDefaultCategorySelection(categoryData: CategoryDatum[]) {
	return (
		categoryData.find((entry) => entry.category === "Food")?.category ??
		categoryData[0]?.category ??
		null
	);
}

export function useCategoryBreakdownData(
	rows: ExpenseRow[],
	year: string,
	monthIndex?: number | null,
): CategoryBreakdownData {
	return useMemo(
		() => getCategoryBreakdownData(rows, year, monthIndex),
		[rows, year, monthIndex],
	);
}
