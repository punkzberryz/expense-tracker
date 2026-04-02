import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

type DashboardEmptyProps = {
	focusYear: string | null;
	availableYears: string[];
	googleSheetUrl: string;
};

export function DashboardEmpty({
	focusYear,
	availableYears,
	googleSheetUrl,
}: DashboardEmptyProps) {
	return (
		<div className="p-6">
			<div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8">
				<div className="max-w-2xl">
					<p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
						Dashboard suggestion
					</p>
					<h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
						Start the dashboard with a year snapshot, not a generic welcome.
					</h1>
					<p className="mt-3 text-sm leading-6 text-slate-600">
						The strongest home page for this app is a decision surface: recent
						spend, biggest drivers, and direct links into the detailed views.
						Right now there is not enough valid sheet data to render that
						snapshot yet.
					</p>
					<div className="mt-6 flex flex-wrap gap-3">
						{focusYear ? (
							<Link
								to="/expense/$year"
								params={{ year: focusYear }}
								className="inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
							>
								Open {focusYear} expenses
							</Link>
						) : null}
						<Link
							to="/expense"
							className="inline-flex items-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
						>
							Browse available years
						</Link>
						<Button
							asChild
							variant="outline"
							className="rounded-full border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
						>
							<a href={googleSheetUrl} target="_blank" rel="noopener">
								Open Google Sheet
							</a>
						</Button>
					</div>
					{availableYears.length > 0 ? (
						<div className="mt-6 flex flex-wrap gap-2">
							{availableYears.map((year) => (
								<Link
									key={year}
									to="/expense/$year"
									params={{ year }}
									className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 hover:border-slate-300 hover:text-slate-900"
								>
									Sheet {year}
								</Link>
							))}
						</div>
					) : (
						<p className="mt-6 text-sm text-slate-500">
							No year-named Google Sheets tabs were found.
						</p>
					)}
				</div>
			</div>
		</div>
	);
}
