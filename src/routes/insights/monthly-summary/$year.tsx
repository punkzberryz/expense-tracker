import {
	Link,
	Outlet,
	createFileRoute,
	useRouterState,
} from "@tanstack/react-router";
import { getExpenseRows } from "@/data/google-sheets";
import { MonthlySummary } from "./components/monthly-summary";

export const Route = createFileRoute("/insights/monthly-summary/$year")({
	loader: async ({ params }) => {
		return getExpenseRows({ data: { year: params.year } });
	},
	component: RouteComponent,
});

function RouteComponent() {
	const rows = Route.useLoaderData();
	const { year } = Route.useParams();
	const pathname = useRouterState({
		select: (state) => state.location.pathname,
	});
	const isMonthView = pathname.startsWith(
		`/insights/monthly-summary/${year}/`,
	);

	if (isMonthView) {
		return <Outlet />;
	}

	return (
		<div className="p-6">
			<div className="mb-4 flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-semibold">Monthly summary · {year}</h1>
					<p className="mt-1 text-sm text-slate-600">
						Monthly totals and averages.
					</p>
				</div>
				<Link
					to="/expense/$year"
					params={{ year }}
					className="text-sm text-blue-600 hover:underline"
				>
					View raw data
				</Link>
			</div>
			<MonthlySummary rows={rows} year={year} />
		</div>
	);
}
