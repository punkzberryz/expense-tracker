import type { CategoryDatum } from "./category-breakdown-data";
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

type CategoryBreakdownTableProps = {
	categoryData: CategoryDatum[];
};

export function CategoryBreakdownTable({
	categoryData,
}: CategoryBreakdownTableProps) {
	return (
		<div className="mt-6">
			<h3 className="text-sm font-semibold text-slate-900">Category details</h3>
			<p className="text-xs text-slate-500">
				Totals, transaction counts, and share of annual spend.
			</p>
			<div className="mt-3 rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Category</TableHead>
							<TableHead className="text-right">Total</TableHead>
							<TableHead className="text-right">Transactions</TableHead>
							<TableHead className="text-right">Avg</TableHead>
							<TableHead className="text-right">Share</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{categoryData.map((category) => (
							<TableRow key={category.category}>
								<TableCell className="font-medium text-slate-700">
									{category.category}
								</TableCell>
								<TableCell className="text-right">
									{formatCurrency(category.total)}
								</TableCell>
								<TableCell className="text-right">{category.count}</TableCell>
								<TableCell className="text-right">
									{formatCurrency(category.average)}
								</TableCell>
								<TableCell className="text-right">
									{percentFormatter.format(category.share)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
