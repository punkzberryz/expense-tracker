import { describe, expect, it } from "vitest";
import type { ExpenseRow } from "@/data/google-sheets";
import {
	getCategoryBreakdownData,
	getCategoryItemBreakdownData,
	getDefaultCategorySelection,
	getGroupedCategoryItemData,
	getHighlightedCategoryItemData,
} from "./category-breakdown/components/category-breakdown-data";
import { getMonthlySummaryData } from "./monthly-summary/components/monthly-summary-data";
import { getTrendLineData } from "./trend-line/components/trend-line-data";

const rows: ExpenseRow[] = [
	{
		date: "2026-01-03",
		name: "Cafe A",
		category: "Food",
		type: "EXPENSE",
		amount: 10.25,
		description: "Breakfast",
	},
	{
		date: "2026-01-03",
		name: "Market",
		category: "Grocery",
		type: "EXPENSE",
		amount: 20.5,
		description: "Snacks",
	},
	{
		date: "2026-02-14",
		name: "Taxi",
		category: "Transport",
		type: "EXPENSE",
		amount: 15,
		description: "Ride",
	},
	{
		date: "2026-02-28",
		name: "Rent",
		category: "Housing",
		type: "EXPENSE",
		amount: 500,
		description: "Monthly rent",
	},
	{
		date: "2026-03-02",
		name: "Cinema",
		category: "Entertainment",
		type: "EXPENSE",
		amount: 12.3,
		description: "Tickets",
	},
	{
		date: "2025-12-31",
		name: "Old Year",
		category: "Food",
		type: "EXPENSE",
		amount: 99,
		description: "Previous year",
	},
	{
		date: "not-a-date",
		name: "Ignored",
		category: "Other",
		type: "EXPENSE",
		amount: 999,
		description: "Invalid date should be ignored",
	},
];

describe("insight data aggregations", () => {
	it("builds trend line data from dated rows in the selected year", () => {
		const result = getTrendLineData(rows, "2026");

		expect(result.totalSpend).toBe(558.05);
		expect(result.monthsWithSpend).toBe(3);
		expect(result.averageActiveMonthSpend).toBe(186.02);
		expect(result.peakMonthIndex).toBe(1);
		expect(result.monthlyTotals[0]).toBe(30.75);
		expect(result.monthlyTotals[1]).toBe(515);
		expect(result.monthlyTotals[2]).toBe(12.3);
		expect(result.highestDailySpend).toBe(500);
		expect(result.highestDailySpendDate).toBe("2026-02-28");
		expect(result.lastActiveDate).toBe("2026-03-02");
		expect(result.monthlyChartData.slice(0, 3)).toEqual([
			{ month: "Jan", spend: 30.75 },
			{ month: "Feb", spend: 515 },
			{ month: "Mar", spend: 12.3 },
		]);
		expect(result.dailyChartData).toEqual([
			{ date: "2026-01-03", daily: 30.75, cumulative: 30.75 },
			{ date: "2026-02-14", daily: 15, cumulative: 45.75 },
			{ date: "2026-02-28", daily: 500, cumulative: 545.75 },
			{ date: "2026-03-02", daily: 12.3, cumulative: 558.05 },
		]);
		expect(result.dailyRowsByDate.get("2026-01-03")).toHaveLength(2);
	});

	it("builds monthly summary stats and shares", () => {
		const result = getMonthlySummaryData(rows, "2026");

		expect(result.totalSpend).toBe(558.05);
		expect(result.monthsWithSpend).toBe(3);
		expect(result.totalTransactions).toBe(5);
		expect(result.peakMonthIndex).toBe(1);
		expect(result.averageMonthlySpend).toBeCloseTo(186.0166667);
		expect(result.averageTransaction).toBeCloseTo(111.61);
		expect(result.monthlyData.slice(0, 3)).toEqual([
			{
				month: "Jan",
				total: 30.75,
				count: 2,
				average: 15.38,
				share: 30.75 / 558.05,
			},
			{
				month: "Feb",
				total: 515,
				count: 2,
				average: 257.5,
				share: 515 / 558.05,
			},
			{
				month: "Mar",
				total: 12.3,
				count: 1,
				average: 12.3,
				share: 12.3 / 558.05,
			},
		]);
	});

	it("builds category breakdown data for full-year and month-filtered views", () => {
		const fullYear = getCategoryBreakdownData(rows, "2026");
		const february = getCategoryBreakdownData(rows, "2026", 1);

		expect(fullYear.totalSpend).toBe(558.05);
		expect(fullYear.totalTransactions).toBe(5);
		expect(fullYear.categoriesWithSpend).toBe(5);
		expect(fullYear.topCategory).toEqual({
			category: "Housing",
			total: 500,
			count: 1,
			average: 500,
			share: 500 / 558.05,
		});
		expect(fullYear.averageTransaction).toBeCloseTo(111.61);
		expect(fullYear.categoryData.map((entry) => entry.category)).toEqual([
			"Housing",
			"Grocery",
			"Transport",
			"Entertainment",
			"Food",
		]);

		expect(february.totalSpend).toBe(515);
		expect(february.totalTransactions).toBe(2);
		expect(february.categoriesWithSpend).toBe(2);
		expect(february.categoryData).toEqual([
			{
				category: "Housing",
				total: 500,
				count: 1,
				average: 500,
				share: 500 / 515,
			},
			{
				category: "Transport",
				total: 15,
				count: 1,
				average: 15,
				share: 15 / 515,
			},
		]);
	});

	it("builds per-item category drilldown data and defaults to Food when present", () => {
		const categoryRows: ExpenseRow[] = [
			{
				date: "2026-01-03",
				name: "Cafe A",
				category: "Food",
				type: "EXPENSE",
				amount: 10.25,
				description: "Breakfast",
			},
			{
				date: "2026-01-03",
				name: "Coffee cart",
				category: "Food",
				type: "EXPENSE",
				amount: 4.75,
				description: "Coffee",
			},
			{
				date: "2026-01-15",
				name: "Bistro",
				category: "Food",
				type: "EXPENSE",
				amount: 18.5,
				description: "Lunch",
			},
			{
				date: "2026-02-01",
				name: "Train",
				category: "Transport",
				type: "EXPENSE",
				amount: 9.5,
				description: "Ticket",
			},
			{
				date: "2025-12-31",
				name: "Old year",
				category: "Food",
				type: "EXPENSE",
				amount: 99,
				description: "Ignore me",
			},
			{
				date: "not-a-date",
				name: "Broken",
				category: "Food",
				type: "EXPENSE",
				amount: 42,
				description: "Ignore me too",
			},
		];
		const categoryBreakdown = getCategoryBreakdownData(categoryRows, "2026");
		const foodItems = getCategoryItemBreakdownData(
			categoryRows,
			"2026",
			"Food",
		);
		const transportItems = getCategoryItemBreakdownData(
			categoryRows,
			"2026",
			"Transport",
		);

		expect(getDefaultCategorySelection(categoryBreakdown.categoryData)).toBe(
			"Food",
		);
		expect(foodItems).toEqual([
			{
				date: "2026-01-03",
				name: "Cafe A",
				amount: 10.25,
				description: "Breakfast",
			},
			{
				date: "2026-01-03",
				name: "Coffee cart",
				amount: 4.75,
				description: "Coffee",
			},
			{
				date: "2026-01-15",
				name: "Bistro",
				amount: 18.5,
				description: "Lunch",
			},
		]);
		expect(transportItems).toEqual([
			{
				date: "2026-02-01",
				name: "Train",
				amount: 9.5,
				description: "Ticket",
			},
		]);
	});

	it("classifies category purchases using hybrid percentile and median thresholds", () => {
		const manyPurchases = [
			{ date: "2026-01-01", name: "A", amount: 10, description: "" },
			{ date: "2026-01-02", name: "B", amount: 11, description: "" },
			{ date: "2026-01-03", name: "C", amount: 12, description: "" },
			{ date: "2026-01-04", name: "D", amount: 13, description: "" },
			{ date: "2026-01-05", name: "E", amount: 20, description: "" },
			{ date: "2026-01-06", name: "F", amount: 21, description: "" },
			{ date: "2026-01-07", name: "G", amount: 22, description: "" },
			{ date: "2026-01-08", name: "H", amount: 40, description: "" },
		];
		const fewPurchases = [
			{ date: "2026-02-01", name: "I", amount: 10, description: "" },
			{ date: "2026-02-02", name: "J", amount: 11, description: "" },
			{ date: "2026-02-03", name: "K", amount: 12, description: "" },
			{ date: "2026-02-04", name: "L", amount: 35, description: "" },
		];

		expect(
			getHighlightedCategoryItemData(manyPurchases).map((item) => ({
				name: item.name,
				highlightLevel: item.highlightLevel,
			})),
		).toEqual([
			{ name: "A", highlightLevel: "normal" },
			{ name: "B", highlightLevel: "normal" },
			{ name: "C", highlightLevel: "normal" },
			{ name: "D", highlightLevel: "normal" },
			{ name: "E", highlightLevel: "normal" },
			{ name: "F", highlightLevel: "normal" },
			{ name: "G", highlightLevel: "high" },
			{ name: "H", highlightLevel: "very-high" },
		]);

		expect(
			getHighlightedCategoryItemData(fewPurchases).map((item) => ({
				name: item.name,
				highlightLevel: item.highlightLevel,
			})),
		).toEqual([
			{ name: "I", highlightLevel: "normal" },
			{ name: "J", highlightLevel: "normal" },
			{ name: "K", highlightLevel: "normal" },
			{ name: "L", highlightLevel: "very-high" },
		]);
	});

	it("groups category purchases by day, week, and month for timeline views", () => {
		const groupedItems = [
			{
				date: "2026-01-05",
				name: "Coffee",
				amount: 5,
				description: "Morning",
			},
			{
				date: "2026-01-05",
				name: "Lunch",
				amount: 12,
				description: "Noon",
			},
			{
				date: "2026-01-08",
				name: "Dinner",
				amount: 18,
				description: "Evening",
			},
			{
				date: "2026-01-20",
				name: "Snacks",
				amount: 7,
				description: "Store",
			},
			{
				date: "2026-02-02",
				name: "Brunch",
				amount: 16,
				description: "Weekend",
			},
		];

		expect(getGroupedCategoryItemData(groupedItems, "day")).toEqual([
			{
				bucketKey: "2026-01-05",
				label: "2026-01-05",
				date: "2026-01-05",
				amount: 17,
				count: 2,
				name: "2 purchases in day",
				description: "Largest purchase: Lunch",
				items: [groupedItems[0], groupedItems[1]],
			},
			{
				bucketKey: "2026-01-08",
				label: "2026-01-08",
				date: "2026-01-08",
				amount: 18,
				count: 1,
				name: "Dinner",
				description: "Evening",
				items: [groupedItems[2]],
			},
			{
				bucketKey: "2026-01-20",
				label: "2026-01-20",
				date: "2026-01-20",
				amount: 7,
				count: 1,
				name: "Snacks",
				description: "Store",
				items: [groupedItems[3]],
			},
			{
				bucketKey: "2026-02-02",
				label: "2026-02-02",
				date: "2026-02-02",
				amount: 16,
				count: 1,
				name: "Brunch",
				description: "Weekend",
				items: [groupedItems[4]],
			},
		]);

		expect(
			getGroupedCategoryItemData(groupedItems, "week").map((item) => ({
				bucketKey: item.bucketKey,
				label: item.label,
				amount: item.amount,
				count: item.count,
			})),
		).toEqual([
			{
				bucketKey: "2026-01-05",
				label: "Jan 5 - Jan 11",
				amount: 35,
				count: 3,
			},
			{
				bucketKey: "2026-01-19",
				label: "Jan 19 - Jan 25",
				amount: 7,
				count: 1,
			},
			{
				bucketKey: "2026-02-02",
				label: "Feb 2 - Feb 8",
				amount: 16,
				count: 1,
			},
		]);

		expect(
			getGroupedCategoryItemData(groupedItems, "month").map((item) => ({
				bucketKey: item.bucketKey,
				label: item.label,
				amount: item.amount,
				count: item.count,
			})),
		).toEqual([
			{
				bucketKey: "2026-01",
				label: "Jan 2026",
				amount: 42,
				count: 4,
			},
			{
				bucketKey: "2026-02",
				label: "Feb 2026",
				amount: 16,
				count: 1,
			},
		]);
	});
});
