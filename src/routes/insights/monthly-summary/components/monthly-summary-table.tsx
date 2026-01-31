import type { MonthlyDatum } from "./monthly-summary-data";
import { formatCurrency } from "@/lib/format";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

const percentFormatter = new Intl.NumberFormat("en-US", {
	style: "percent",
	maximumFractionDigits: 1,
});

type MonthlySummaryTableProps = {
	monthlyData: MonthlyDatum[];
};

export function MonthlySummaryTable({ monthlyData }: MonthlySummaryTableProps) {
	return (
		<div className="mt-6">
			<h3 className="text-sm font-semibold text-slate-900">Month-by-month</h3>
			<p className="text-xs text-slate-500">
				Totals, transactions, and share of the annual spend.
			</p>
			<div className="mt-3 rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Month</TableHead>
							<TableHead className="text-right">Total</TableHead>
							<TableHead className="text-right">Transactions</TableHead>
							<TableHead className="text-right">Avg</TableHead>
							<TableHead className="text-right">Share</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{monthlyData.map((month) => (
							<TableRow key={month.month}>
								<TableCell className="font-medium text-slate-700">
									{month.month}
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
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
