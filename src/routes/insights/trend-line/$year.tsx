import { createFileRoute, Link } from "@tanstack/react-router";
import { getExpenseRows } from "@/data/google-sheets";
import { TrendLine } from "@/routes/expense/components/trend-line";

export const Route = createFileRoute("/insights/trend-line/$year")({
	loader: async ({ params }) => {
		return getExpenseRows({ data: { year: params.year } });
	},
	component: RouteComponent,
});

function RouteComponent() {
	const rows = Route.useLoaderData();
	const { year } = Route.useParams();

	return (
		<div className="p-6">
			<div className="mb-4 flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-semibold">Trend line · {year}</h1>
					<p className="mt-1 text-sm text-slate-600">Monthly spend trend.</p>
				</div>
				<Link
					to="/expense/$year"
					params={{ year }}
					className="text-sm text-blue-600 hover:underline"
				>
					View raw data
				</Link>
			</div>
			<TrendLine rows={rows} year={year} />
		</div>
	);
}
