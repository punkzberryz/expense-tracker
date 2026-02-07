import { createFileRoute, Link } from "@tanstack/react-router";
import { getExpenseRows } from "@/data/google-sheets";
import { MonthlySummaryEmpty } from "../components/monthly-summary-empty";
import { MONTH_LABELS } from "../components/monthly-summary-data";
import { MonthlySummaryPieChart } from "../components/monthly-summary-pie-chart";

export const Route = createFileRoute(
	"/insights/monthly-summary/$year/$month",
)({
	loader: async ({ params }) => {
		return getExpenseRows({ data: { year: params.year } });
	},
	component: RouteComponent,
});

function RouteComponent() {
	const rows = Route.useLoaderData();
	const { year, month } = Route.useParams();
	const monthNumber = Number(month);
	const monthIndex = Number.isInteger(monthNumber) ? monthNumber - 1 : Number.NaN;
	const isValidMonth = monthIndex >= 0 && monthIndex < 12;
	const monthLabel = isValidMonth ? MONTH_LABELS[monthIndex] : "—";

	if (!isValidMonth) {
		return (
			<div className="p-6">
				<div className="mb-4 flex items-center justify-between">
					<div>
						<h1 className="text-2xl font-semibold">Monthly summary</h1>
						<p className="mt-1 text-sm text-slate-600">
							Invalid month selection.
						</p>
					</div>
					<Link
						to="/insights/monthly-summary/$year"
						params={{ year }}
						className="text-sm text-blue-600 hover:underline"
					>
						Back to yearly summary
					</Link>
				</div>
				<MonthlySummaryEmpty
					title="Invalid month"
					description="Select a month between 01 and 12."
				/>
			</div>
		);
	}

	return (
		<div className="p-6">
			<div className="mb-4 flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-semibold">
						Monthly summary · {monthLabel} {year}
					</h1>
					<p className="mt-1 text-sm text-slate-600">
						Category breakdown for {monthLabel} {year}.
					</p>
				</div>
				<Link
					to="/insights/monthly-summary/$year"
					params={{ year }}
					className="text-sm text-blue-600 hover:underline"
				>
					Back to yearly summary
				</Link>
			</div>
			<div className="rounded-md border border-slate-200 bg-white p-4">
				<MonthlySummaryPieChart
					rows={rows}
					year={year}
					defaultMonthIndex={monthIndex}
					showPeriodSelect={false}
				/>
			</div>
		</div>
	);
}
