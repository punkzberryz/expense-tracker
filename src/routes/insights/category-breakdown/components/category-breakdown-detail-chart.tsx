import { useMemo, useState } from "react";
import type { TooltipProps } from "recharts";
import { Bar, BarChart, Cell, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { formatCurrency, formatShortDate } from "@/lib/format";
import type {
	CategoryDatum,
	CategoryItemGrouping,
	GroupedCategoryItemDatum,
} from "./category-breakdown-data";
import {
	getGroupedCategoryItemData,
	getHighlightedCategoryItemData,
} from "./category-breakdown-data";

type CategoryBreakdownDetailChartProps = {
	category: CategoryDatum;
	itemData: GroupedCategoryItemDatum["items"];
};

const GROUPING_OPTIONS: Array<{
	value: CategoryItemGrouping;
	label: string;
}> = [
	{ value: "day", label: "Day" },
	{ value: "week", label: "Week" },
	{ value: "month", label: "Month" },
];

function CategoryBreakdownDetailTooltip({
	active,
	payload,
}: TooltipProps<number, string>) {
	const entry = payload?.[0]?.payload as
		| ReturnType<typeof getHighlightedCategoryItemData>[number]
		| undefined;

	if (!active || !entry) return null;

	return (
		<div className="rounded-md border border-slate-200 bg-white p-2 text-xs text-slate-700 shadow-sm">
			<div className="font-medium text-slate-900">{entry.label}</div>
			<div className="mt-1 text-slate-600">{entry.name}</div>
			{entry.description ? (
				<div className="text-slate-500">{entry.description}</div>
			) : null}
			{entry.count > 1 ? (
				<div className="mt-1 text-slate-500">
					{entry.count} purchases in this period
				</div>
			) : null}
			<div className="mt-1 font-medium text-slate-900">
				{formatCurrency(entry.amount)}
			</div>
			<div className="mt-1 text-slate-500">
				{entry.highlightLevel === "very-high"
					? "Very high purchase"
					: entry.highlightLevel === "high"
						? "High purchase"
						: "Typical purchase"}
			</div>
		</div>
	);
}

export function CategoryBreakdownDetailChart({
	category,
	itemData,
}: CategoryBreakdownDetailChartProps) {
	const [grouping, setGrouping] = useState<CategoryItemGrouping>("day");
	const highestPurchase = itemData.reduce<number>(
		(highest, item) => Math.max(highest, item.amount),
		0,
	);
	const groupedItems = useMemo(
		() => getGroupedCategoryItemData(itemData, grouping),
		[itemData, grouping],
	);
	const highlightedItems = useMemo(
		() => getHighlightedCategoryItemData(groupedItems),
		[groupedItems],
	);
	const veryHighCount = highlightedItems.filter(
		(item) => item.highlightLevel === "very-high",
	).length;
	const highCount = highlightedItems.filter(
		(item) => item.highlightLevel === "high",
	).length;

	return (
		<section className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
						Purchase timeline
					</p>
					<h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">
						{category.category} purchases
					</h3>
					<p className="mt-2 text-sm leading-6 text-slate-600">
						{category.count} purchase{category.count === 1 ? "" : "s"} totaling{" "}
						{formatCurrency(category.total)}. Switch between day, week, and
						month to see how this category accumulates over time.
					</p>
				</div>
				<div className="grid gap-3 sm:grid-cols-2">
					<DetailMetric
						label="Average purchase"
						value={formatCurrency(category.average)}
					/>
					<DetailMetric
						label="Largest purchase"
						value={formatCurrency(highestPurchase)}
					/>
				</div>
			</div>
			<div className="mt-6 flex flex-wrap items-center justify-between gap-3">
				<p className="text-xs uppercase tracking-[0.16em] text-slate-500">
					Grouped by {grouping}
				</p>
				<div
					role="tablist"
					aria-label="Group purchases by period"
					className="inline-flex rounded-full border border-slate-200 bg-slate-100 p-1"
				>
					{GROUPING_OPTIONS.map((option) => {
						const isActive = grouping === option.value;
						return (
							<button
								key={option.value}
								type="button"
								role="tab"
								aria-selected={isActive}
								onClick={() => setGrouping(option.value)}
								className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
									isActive
										? "bg-white text-slate-950 shadow-sm"
										: "text-slate-600 hover:text-slate-900"
								}`}
							>
								{option.label}
							</button>
						);
					})}
				</div>
			</div>
			<div className="mt-6">
				<ChartContainer
					config={{
						amount: { label: "Typical", color: "#2563eb" },
						high: { label: "High", color: "#f59e0b" },
						veryHigh: { label: "Very high", color: "#e11d48" },
					}}
					className="h-[300px] w-full"
				>
					<BarChart
						data={highlightedItems}
						margin={{ left: 8, right: 8, top: 8 }}
					>
						<XAxis
							dataKey="label"
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							minTickGap={24}
							tickFormatter={(value) =>
								grouping === "day"
									? formatShortDate(String(value))
									: String(value)
							}
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
							radius={[8, 8, 0, 0]}
						>
							{highlightedItems.map((item) => (
								<Cell
									key={`${item.date}-${item.name}-${item.amount}`}
									fill={
										item.highlightLevel === "very-high"
											? "var(--color-veryHigh)"
											: item.highlightLevel === "high"
												? "var(--color-high)"
												: "var(--color-amount)"
									}
								/>
							))}
						</Bar>
					</BarChart>
				</ChartContainer>
			</div>
			<div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-600">
				<LegendSwatch color="var(--color-amount)" label="Typical" />
				<LegendSwatch color="var(--color-high)" label="High" />
				<LegendSwatch color="var(--color-veryHigh)" label="Very high" />
				<p className="text-slate-500">
					{veryHighCount > 0 || highCount > 0
						? `${veryHighCount} very high and ${highCount} high purchase${
								veryHighCount + highCount === 1 ? "" : "s"
							} based on category-relative thresholds for this ${grouping} view.`
						: `No standout purchases crossed the category-relative thresholds for this ${grouping} view.`}
				</p>
			</div>
		</section>
	);
}

function DetailMetric({ label, value }: { label: string; value: string }) {
	return (
		<div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
			<p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
				{label}
			</p>
			<p className="mt-2 text-lg font-semibold text-slate-950">{value}</p>
		</div>
	);
}

function LegendSwatch({ color, label }: { color: string; label: string }) {
	return (
		<div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">
			<span
				className="inline-block size-2.5 rounded-full"
				style={{ backgroundColor: color }}
			/>
			<span>{label}</span>
		</div>
	);
}
