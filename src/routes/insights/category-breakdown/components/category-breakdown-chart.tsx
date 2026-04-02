import type { TooltipProps } from "recharts";
import { Bar, BarChart, Cell, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { formatCurrency } from "@/lib/format";
import type { CategoryDatum } from "./category-breakdown-data";

const percentFormatter = new Intl.NumberFormat("en-US", {
	style: "percent",
	maximumFractionDigits: 1,
});

type CategoryBreakdownChartProps = {
	categoryData: CategoryDatum[];
	selectedCategory: string | null;
};

export function CategoryBreakdownChart({
	categoryData,
	selectedCategory,
}: CategoryBreakdownChartProps) {
	return (
		<section className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm">
			<div className="flex flex-wrap items-start justify-between gap-3">
				<div>
					<h3 className="text-lg font-semibold text-slate-950">
						Spend by category
					</h3>
					<p className="mt-1 text-sm text-slate-600">
						The largest categories appear first so concentration is easy to
						spot.
					</p>
				</div>
				<p className="text-xs uppercase tracking-[0.16em] text-slate-500">
					{selectedCategory
						? `Highlighting ${selectedCategory}`
						: "All categories"}
				</p>
			</div>
			<ChartContainer
				config={{
					total: { label: "Spend", color: "#0f766e" },
					totalHighlight: { label: "Selected", color: "#f59e0b" },
				}}
				className="mt-6 h-[340px] w-full"
			>
				<BarChart
					data={categoryData}
					layout="vertical"
					margin={{ left: 8, right: 12, top: 4, bottom: 4 }}
				>
					<XAxis
						type="number"
						tickLine={false}
						axisLine={false}
						tickMargin={8}
						tickFormatter={(value) => formatCurrency(Number(value))}
						className="text-xs text-slate-500"
					/>
					<YAxis
						type="category"
						dataKey="category"
						axisLine={false}
						tickLine={false}
						width={132}
						className="text-xs text-slate-500"
					/>
					<ChartTooltip
						cursor={{ fill: "rgba(15, 23, 42, 0.08)" }}
						content={<CategoryBreakdownChartTooltip />}
					/>
					<Bar
						dataKey="total"
						name="Spend"
						fill="var(--color-total)"
						radius={[0, 8, 8, 0]}
						barSize={18}
					>
						{categoryData.map((entry) => (
							<Cell
								key={entry.category}
								fill={
									entry.category === selectedCategory
										? "var(--color-totalHighlight)"
										: "var(--color-total)"
								}
								opacity={
									selectedCategory && entry.category !== selectedCategory
										? 0.45
										: 0.95
								}
							/>
						))}
					</Bar>
				</BarChart>
			</ChartContainer>
		</section>
	);
}

function CategoryBreakdownChartTooltip({
	active,
	payload,
}: TooltipProps<number, string>) {
	const entry = payload?.[0]?.payload as CategoryDatum | undefined;

	if (!active || !entry) return null;

	return (
		<div className="rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-700 shadow-sm">
			<p className="font-medium text-slate-950">{entry.category}</p>
			<div className="mt-2 space-y-1.5 text-slate-600">
				<div className="flex items-center justify-between gap-4">
					<span>Spend</span>
					<span className="font-medium text-slate-950">
						{formatCurrency(entry.total)}
					</span>
				</div>
				<div className="flex items-center justify-between gap-4">
					<span>Transactions</span>
					<span className="font-medium text-slate-950">{entry.count}</span>
				</div>
				<div className="flex items-center justify-between gap-4">
					<span>Share</span>
					<span className="font-medium text-slate-950">
						{percentFormatter.format(entry.share)}
					</span>
				</div>
			</div>
		</div>
	);
}
