import type { TooltipProps } from "recharts";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { formatCurrency, formatShortDate } from "@/lib/format";
import type {
	CategoryDatum,
	CategoryItemDatum,
} from "./category-breakdown-data";

type CategoryBreakdownDetailChartProps = {
	category: CategoryDatum;
	itemData: CategoryItemDatum[];
};

function CategoryBreakdownDetailTooltip({
	active,
	label,
	payload,
}: TooltipProps<number, string>) {
	const entry = payload?.[0]?.payload as CategoryItemDatum | undefined;

	if (!active || !entry) return null;

	return (
		<div className="rounded-md border border-slate-200 bg-white p-2 text-xs text-slate-700 shadow-sm">
			<div className="font-medium text-slate-900">
				{formatShortDate(label ?? "")}
			</div>
			<div className="mt-1 text-slate-600">{entry.name}</div>
			{entry.description ? (
				<div className="text-slate-500">{entry.description}</div>
			) : null}
			<div className="mt-1 font-medium text-slate-900">
				{formatCurrency(entry.amount)}
			</div>
		</div>
	);
}

export function CategoryBreakdownDetailChart({
	category,
	itemData,
}: CategoryBreakdownDetailChartProps) {
	return (
		<div className="mt-6">
			<h3 className="text-sm font-semibold text-slate-900">
				{category.category} items
			</h3>
			<p className="text-xs text-slate-500">
				{category.count} purchases totaling {formatCurrency(category.total)}.
				Hover a bar to see the item details.
			</p>
			<div className="mt-3">
				<ChartContainer
					config={{
						amount: { label: "Spend", color: "var(--color-chart-2)" },
					}}
					className="h-64 w-full"
				>
					<BarChart data={itemData} margin={{ left: 8, right: 8, top: 8 }}>
						<XAxis
							dataKey="date"
							allowDuplicatedCategory
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							minTickGap={24}
							tickFormatter={formatShortDate}
							className="text-xs text-slate-500"
						/>
						<YAxis
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							tickFormatter={(value) => formatCurrency(Number(value))}
							className="text-xs text-slate-500"
						/>
						<ChartTooltip
							cursor={{ fill: "rgba(15, 23, 42, 0.08)" }}
							content={<CategoryBreakdownDetailTooltip />}
						/>
						<Bar
							dataKey="amount"
							name="Spend"
							fill="var(--color-amount)"
							radius={[4, 4, 0, 0]}
						/>
					</BarChart>
				</ChartContainer>
			</div>
		</div>
	);
}
