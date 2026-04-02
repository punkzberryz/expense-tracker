import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { CategoryDatum } from "./category-breakdown-data";

const percentFormatter = new Intl.NumberFormat("en-US", {
	style: "percent",
	maximumFractionDigits: 1,
});

type CategoryBreakdownTableProps = {
	categoryData: CategoryDatum[];
	selectedCategory: string | null;
	onSelectCategory: (category: string) => void;
};

export function CategoryBreakdownTable({
	categoryData,
	selectedCategory,
	onSelectCategory,
}: CategoryBreakdownTableProps) {
	return (
		<div className="mt-6">
			<h3 className="text-sm font-semibold text-slate-900">Category details</h3>
			<p className="text-xs text-slate-500">
				Totals, transaction counts, and share of annual spend. Click a category
				to inspect its items by date.
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
						{categoryData.map((category) => {
							const isSelected = category.category === selectedCategory;

							return (
								<TableRow
									key={category.category}
									data-state={isSelected ? "selected" : undefined}
								>
									<TableCell className="font-medium text-slate-700">
										<button
											type="button"
											onClick={() => onSelectCategory(category.category)}
											className={cn(
												"w-full rounded-sm px-1 py-1 text-left transition-colors hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300",
												isSelected && "text-slate-900",
											)}
										>
											{category.category}
										</button>
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
							);
						})}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
