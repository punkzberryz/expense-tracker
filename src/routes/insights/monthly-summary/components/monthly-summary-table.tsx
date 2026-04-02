import { Link } from "@tanstack/react-router";
import { ArrowRightIcon } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { MonthlyDatum } from "./monthly-summary-data";

const percentFormatter = new Intl.NumberFormat("en-US", {
	style: "percent",
	maximumFractionDigits: 1,
});

type MonthlySummaryTableProps = {
	monthlyData: MonthlyDatum[];
	year: string;
	peakMonthIndex: number;
};

export function MonthlySummaryTable({
	monthlyData,
	year,
	peakMonthIndex,
}: MonthlySummaryTableProps) {
	return (
		<section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
			<div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<h3 className="text-lg font-semibold text-slate-950">
						Month-by-month
					</h3>
					<p className="mt-1 text-sm leading-6 text-slate-600">
						Totals, transaction count, and share of the annual spend with direct
						drilldown into each month.
					</p>
				</div>
				<div className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
					Peak month highlighted
				</div>
			</div>
			<div className="mt-5 overflow-hidden rounded-[24px] border border-slate-200">
				<Table>
					<TableHeader>
						<TableRow className="bg-slate-50">
							<TableHead>Month</TableHead>
							<TableHead className="text-right">Total</TableHead>
							<TableHead className="text-right">Transactions</TableHead>
							<TableHead className="text-right">Avg</TableHead>
							<TableHead className="text-right">Share</TableHead>
							<TableHead className="text-right">Explore</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{monthlyData.map((month, index) => {
							const monthParam = String(index + 1).padStart(2, "0");
							const isPeakMonth =
								peakMonthIndex >= 0 && index === peakMonthIndex && month.total > 0;
							const isQuietMonth = month.total <= 0;

							return (
								<TableRow
									key={month.month}
									className={
										isPeakMonth
											? "bg-emerald-50/80 hover:bg-emerald-50/80"
											: isQuietMonth
												? "bg-slate-50/60 text-slate-500 hover:bg-slate-50/60"
												: "hover:bg-slate-50/80"
									}
								>
									<TableCell className="font-medium text-slate-700">
										<Link
											to="/insights/monthly-summary/$year/$month"
											params={{ year, month: monthParam }}
											className="inline-flex items-center gap-2 text-sky-700 hover:text-sky-900"
										>
											{month.month}
											{isPeakMonth ? (
												<span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-medium uppercase tracking-[0.14em] text-emerald-700">
													Peak
												</span>
											) : null}
										</Link>
									</TableCell>
									<TableCell className="text-right">
										{formatCurrency(month.total)}
									</TableCell>
									<TableCell className="text-right">{month.count}</TableCell>
									<TableCell className="text-right">
										{formatCurrency(month.average)}
									</TableCell>
									<TableCell className="text-right">
										{percentFormatter.format(month.share)}
									</TableCell>
									<TableCell className="text-right">
										<Link
											to="/insights/monthly-summary/$year/$month"
											params={{ year, month: monthParam }}
											className="inline-flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-slate-950"
										>
											Open
											<ArrowRightIcon className="size-4" />
										</Link>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</div>
		</section>
	);
}
