import { Link } from "@tanstack/react-router";
import { ArrowUpRightIcon } from "lucide-react";
import { formatCurrency, formatShortDate } from "@/lib/format";
import type { DashboardData } from "./dashboard-data";

type DashboardRecentTransactionsProps = {
	data: DashboardData;
};

export function DashboardRecentTransactions({
	data,
}: DashboardRecentTransactionsProps) {
	return (
		<div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
			<div className="flex items-start justify-between gap-4">
				<div>
					<p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
						Recent activity
					</p>
					<h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">
						Latest recorded expenses
					</h2>
				</div>
				<Link
					to="/expense/$year"
					params={{ year: data.focusYear }}
					className="inline-flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-950"
				>
					Full table
					<ArrowUpRightIcon className="size-4" />
				</Link>
			</div>
			<div className="mt-5 divide-y divide-slate-100">
				{data.recentTransactions.map((row) => (
					<div
						key={`${row.date}-${row.name}-${row.amount}`}
						className="flex items-center justify-between gap-4 py-3"
					>
						<div className="min-w-0">
							<p className="truncate text-sm font-medium text-slate-900">
								{row.name}
							</p>
							<p className="mt-1 text-xs text-slate-500">
								{row.category} · {formatShortDate(row.date)}
							</p>
						</div>
						<div className="text-right">
							<p className="text-sm font-semibold text-slate-900">
								{formatCurrency(row.amount)}
							</p>
							<p className="mt-1 text-xs text-slate-500">{row.type}</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
