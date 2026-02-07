import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { getExpenseRows } from "@/data/google-sheets";
import { parseYearMonth } from "@/lib/format";
import { MonthlySummaryEmpty } from "../../components/monthly-summary-empty";
import { MONTH_LABELS } from "../../components/monthly-summary-data";
import { MonthlySummaryPieChart } from "../../components/monthly-summary-pie-chart";
import { ExpenseTable } from "@/routes/expense/components/expense-table";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute(
	"/insights/monthly-summary/$year/$month/",
)({
	loader: async ({ params }) => {
		return getExpenseRows({ data: { year: params.year } });
	},
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = Route.useNavigate();
	const rows = Route.useLoaderData();
	const { year, month } = Route.useParams();
	const monthNumber = Number(month);
	const monthIndex = Number.isInteger(monthNumber) ? monthNumber - 1 : Number.NaN;
	const isValidMonth = monthIndex >= 0 && monthIndex < 12;
	const monthLabel = isValidMonth ? MONTH_LABELS[monthIndex] : "—";
	const selectedMonthParam = isValidMonth
		? String(monthIndex + 1).padStart(2, "0")
		: "";
	const monthOptions = MONTH_LABELS.map((label, index) => ({
		label,
		value: String(index + 1).padStart(2, "0"),
	}));
	const selectValue = isValidMonth ? selectedMonthParam : undefined;
	const monthRows = useMemo(() => {
		if (!isValidMonth) return [];
		return rows.filter((row) => {
			const parsed = parseYearMonth(row.date);
			if (!parsed) return false;
			return parsed.year === year && parsed.monthIndex === monthIndex;
		});
	}, [isValidMonth, monthIndex, rows, year]);

	const handleMonthChange = (nextMonth: string) => {
		if (!nextMonth || nextMonth === selectedMonthParam) return;
		navigate({
			to: "/insights/monthly-summary/$year/$month",
			params: { year, month: nextMonth },
		});
	};

	const monthSelect = (
		<Select value={selectValue} onValueChange={handleMonthChange}>
			<SelectTrigger size="sm" className="w-44">
				<SelectValue placeholder="Select month" />
			</SelectTrigger>
			<SelectContent align="end">
				{monthOptions.map((option) => (
					<SelectItem key={option.value} value={option.value}>
						{option.label} {year}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);

	if (!isValidMonth) {
		return (
			<div className="p-6">
				<div className="mb-4 flex flex-wrap items-start justify-between gap-3">
					<div>
						<h1 className="text-2xl font-semibold">Monthly summary</h1>
						<p className="mt-1 text-sm text-slate-600">
							Invalid month selection.
						</p>
					</div>
					<div className="flex flex-wrap items-center gap-2">
						{monthSelect}
						<Link
							to="/insights/monthly-summary/$year"
							params={{ year }}
							className="text-sm text-blue-600 hover:underline"
						>
							Back to yearly summary
						</Link>
					</div>
				</div>
				<MonthlySummaryEmpty
					title="Invalid month"
					description="Select a month between 01 and 12."
				/>
			</div>
		)
	}

	return (
		<div className="p-6">
			<div className="mb-4 flex flex-wrap items-start justify-between gap-3">
				<div>
					<h1 className="text-2xl font-semibold">
						Monthly summary · {monthLabel} {year}
					</h1>
					<p className="mt-1 text-sm text-slate-600">
						Category breakdown for {monthLabel} {year}.
					</p>
				</div>
				<div className="flex flex-wrap items-center gap-2">
					{monthSelect}
					<Link
						to="/insights/monthly-summary/$year"
						params={{ year }}
						className="text-sm text-blue-600 hover:underline"
					>
						Back to yearly summary
					</Link>
				</div>
			</div>
			<div className="rounded-md border border-slate-200 bg-white p-4">
				<MonthlySummaryPieChart
					rows={rows}
					year={year}
					defaultMonthIndex={monthIndex}
					showPeriodSelect={false}
				/>
			</div>
			<div className="mt-6">
				<div>
					<h2 className="text-sm font-semibold text-slate-900">
						Expenses for {monthLabel} {year}
					</h2>
					<p className="text-xs text-slate-500">
						Transactions recorded in {monthLabel} {year}.
					</p>
				</div>
				<div className="mt-3">
					<ExpenseTable
						rows={monthRows}
						emptyMessage="No expenses found for this month."
					/>
				</div>
			</div>
		</div>
	)
}
