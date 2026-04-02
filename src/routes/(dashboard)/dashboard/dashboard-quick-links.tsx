import { Link } from "@tanstack/react-router";
import {
	ArrowRightIcon,
	BarChart3Icon,
	ChartLineIcon,
	PieChartIcon,
	ReceiptTextIcon,
} from "lucide-react";
import type { DashboardData } from "./dashboard-data";

type DashboardQuickLinksProps = {
	data: DashboardData;
};

const quickLinks = [
	{
		label: "Expense table",
		description: "Scan every transaction and filter by merchant or category.",
		to: "/expense/$year" as const,
		icon: ReceiptTextIcon,
	},
	{
		label: "Trend line",
		description: "Open the full monthly and daily spend trend view.",
		to: "/insights/trend-line/$year" as const,
		icon: ChartLineIcon,
	},
	{
		label: "Category breakdown",
		description: "See which categories are dominating the year.",
		to: "/insights/category-breakdown/$year" as const,
		icon: PieChartIcon,
	},
	{
		label: "Monthly summary",
		description: "Compare months, averages, and category mix.",
		to: "/insights/monthly-summary/$year" as const,
		icon: BarChart3Icon,
	},
] as const;

export function DashboardQuickLinks({ data }: DashboardQuickLinksProps) {
	return (
		<div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
			<p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
				Next actions
			</p>
			<h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">
				Suggested drill downs from the dashboard
			</h2>
			<div className="mt-5 grid gap-3">
				{quickLinks.map((link) => {
					const Icon = link.icon;

					return (
						<Link
							key={link.to}
							to={link.to}
							params={{ year: data.focusYear }}
							className="group rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300 hover:bg-white"
						>
							<div className="flex items-start justify-between gap-4">
								<div className="flex gap-3">
									<div className="flex size-10 items-center justify-center rounded-2xl bg-white text-slate-700 ring-1 ring-slate-200">
										<Icon className="size-5" />
									</div>
									<div>
										<p className="text-sm font-medium text-slate-950">
											{link.label}
										</p>
										<p className="mt-1 text-sm leading-6 text-slate-600">
											{link.description}
										</p>
									</div>
								</div>
								<ArrowRightIcon className="mt-1 size-4 text-slate-400 transition group-hover:text-slate-700" />
							</div>
						</Link>
					);
				})}
			</div>
		</div>
	);
}
