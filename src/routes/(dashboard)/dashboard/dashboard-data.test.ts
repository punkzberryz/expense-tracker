import { describe, expect, it } from "vitest";
import type { ExpenseRow } from "@/data/google-sheets";
import { buildDashboardData } from "./dashboard-data";

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
		date: "2026-02-10",
		name: "Utility Co",
		category: "Utility",
		type: "EXPENSE",
		amount: 95,
		description: "Bill",
	},
	{
		date: "2026-02-20",
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
		date: "2026-03-12",
		name: "Grocer",
		category: "Grocery",
		type: "EXPENSE",
		amount: 84.5,
		description: "Weekly shop",
	},
	{
		date: "2025-12-31",
		name: "Old Year",
		category: "Food",
		type: "EXPENSE",
		amount: 200,
		description: "Previous year",
	},
	{
		date: "bad-date",
		name: "Invalid",
		category: "Other",
		type: "EXPENSE",
		amount: 999,
		description: "Invalid date",
	},
];

describe("buildDashboardData", () => {
	it("summarizes the selected year for the home page", () => {
		const result = buildDashboardData(rows, "2026", ["2026", "2025"]);

		expect(result.totalSpend).toBe(702.05);
		expect(result.totalTransactions).toBe(5);
		expect(result.averageTransaction).toBeCloseTo(140.41);
		expect(result.activeDays).toBe(5);
		expect(result.currentMonthLabel).toBe("Mar");
		expect(result.currentMonthSpend).toBe(96.8);
		expect(result.previousMonthLabel).toBe("Feb");
		expect(result.previousMonthSpend).toBe(595);
		expect(result.monthOverMonthChange).toBeCloseTo(-83.7310924);
		expect(result.peakMonthLabel).toBe("Feb");
		expect(result.topCategory).toBe("Housing");
		expect(result.topCategories.map((entry) => entry.category)).toEqual([
			"Housing",
			"Utility",
			"Grocery",
			"Entertainment",
			"Food",
		]);
		expect(result.largestExpense?.name).toBe("Rent");
		expect(result.recentTransactions.map((entry) => entry.name)).toEqual([
			"Grocer",
			"Cinema",
			"Rent",
			"Utility Co",
			"Cafe A",
		]);
	});

	it("returns a null month-over-month change when there is no prior active month", () => {
		const firstMonthRows: ExpenseRow[] = [
			{
				date: "2026-01-15",
				name: "Lunch",
				category: "Food",
				type: "EXPENSE",
				amount: 24,
				description: "Meal",
			},
		];
		const result = buildDashboardData(firstMonthRows, "2026", ["2026"]);

		expect(result.currentMonthLabel).toBe("Jan");
		expect(result.previousMonthLabel).toBeNull();
		expect(result.monthOverMonthChange).toBeNull();
	});
});
