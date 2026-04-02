import { createFileRoute, Link } from "@tanstack/react-router";
import {
	ArrowRightIcon,
	CalendarRangeIcon,
	TablePropertiesIcon,
} from "lucide-react";
import { getAvailableYears, getExpenseRows } from "@/data/google-sheets";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { TrendLine } from "./components/trend-line";

export const Route = createFileRoute("/insights/trend-line/$year")({
	loader: async ({ params }) => {
		const [rows, availableYears] = await Promise.all([
			getExpenseRows({ data: { year: params.year } }),
			getAvailableYears(),
		]);

		return { rows, availableYears };
	},
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = Route.useNavigate();
	const { rows, availableYears } = Route.useLoaderData();
	const { year } = Route.useParams();

	const handleYearChange = (nextYear: string) => {
		if (!nextYear || nextYear === year) return;
		navigate({
			to: "/insights/trend-line/$year",
			params: { year: nextYear },
		});
	};

	return (
		<div className="min-h-full bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.12),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(20,184,166,0.12),_transparent_28%)] p-6">
			<div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
				<section className="rounded-[28px] border border-slate-200 bg-gradient-to-br from-amber-50 via-white to-teal-50 p-6 shadow-sm">
					<div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_auto] lg:items-end">
						<div>
							<div className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/80 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-600 shadow-sm backdrop-blur">
								<CalendarRangeIcon className="size-3.5 text-amber-500" />
								Insight view
							</div>
							<h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
								Trend line for {year}
							</h1>
							<p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
								Track how spending rises month by month, then drill into the
								daily buildup when a spike needs explanation.
							</p>
						</div>
						<div className="flex flex-wrap gap-3">
							{availableYears.length > 0 ? (
								<Select value={year} onValueChange={handleYearChange}>
									<SelectTrigger className="h-10 w-[10rem] rounded-full border-slate-300 bg-white text-slate-700 shadow-sm">
										<SelectValue placeholder="Select year" />
									</SelectTrigger>
									<SelectContent align="end">
										{availableYears.map((availableYear) => (
											<SelectItem key={availableYear} value={availableYear}>
												{availableYear}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							) : null}
							<Link
								to="/expense/$year"
								params={{ year }}
								className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
							>
								View raw data
								<ArrowRightIcon className="size-4" />
							</Link>
							<Link
								to="/insights/monthly-summary/$year"
								params={{ year }}
								className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
							>
								<TablePropertiesIcon className="size-4" />
								Monthly summary
							</Link>
						</div>
					</div>
				</section>
				<TrendLine rows={rows} year={year} />
			</div>
		</div>
	);
}
