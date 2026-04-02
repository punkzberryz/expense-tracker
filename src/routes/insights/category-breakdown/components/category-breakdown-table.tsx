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
		<section className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm">
			<div className="flex flex-wrap items-start justify-between gap-3">
				<div>
					<h3 className="text-lg font-semibold text-slate-950">
						Category details
					</h3>
					<p className="mt-1 text-sm text-slate-600">
						Totals, transaction counts, and share of annual spend. Select a row
						to load its purchase timeline.
					</p>
				</div>
				<p className="text-xs uppercase tracking-[0.16em] text-slate-500">
					{categoryData.length} categories
				</p>
			</div>
			<div className="mt-4 rounded-2xl border border-slate-200">
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
									className={cn(
										"border-slate-200",
										isSelected && "bg-amber-50/70 hover:bg-amber-50/70",
									)}
								>
									<TableCell className="min-w-[13rem] font-medium text-slate-700">
										<button
											type="button"
											aria-pressed={isSelected}
											onClick={() => onSelectCategory(category.category)}
											className={cn(
												"flex w-full flex-col items-start rounded-lg px-2 py-1.5 text-left transition-colors hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300",
												isSelected && "text-slate-950",
											)}
										>
											<span>{category.category}</span>
											<span className="text-xs font-normal text-slate-500">
												{isSelected ? "Selected category" : "Inspect purchases"}
											</span>
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
		</section>
	);
}
