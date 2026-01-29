import { createFileRoute, Link } from "@tanstack/react-router";
import { getExpenseRows } from "@/data/google-sheets";
import { ExpenseTable } from "@/routes/expense/components/expense-table";

export const Route = createFileRoute("/expense/$year")({
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
				<h1 className="text-2xl font-semibold">Expenses · {year}</h1>
				<Link to="/expense" className="text-sm text-blue-600 hover:underline">
					Change year
				</Link>
			</div>

			<ExpenseTable rows={rows} />
		</div>
	);
}
