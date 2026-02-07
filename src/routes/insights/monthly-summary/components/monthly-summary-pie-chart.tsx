import { useEffect, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Cell, Pie, PieChart } from "recharts";
import type { ExpenseRow } from "@/data/google-sheets";
import { formatCurrency } from "@/lib/format";
import {
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCategoryBreakdownData } from "@/routes/insights/category-breakdown/components/category-breakdown-data";
import { MONTH_LABELS } from "./monthly-summary-data";

const PIE_COLORS = [
	"var(--color-chart-1)",
	"var(--color-chart-2)",
	"var(--color-chart-3)",
	"var(--color-chart-4)",
	"var(--color-chart-5)",
];

type MonthlySummaryPieChartProps = {
	rows: ExpenseRow[];
	year: string;
	defaultMonthIndex?: number | null;
	showPeriodSelect?: boolean;
};

type CategoryPieDatum = {
	key: string;
	label: string;
	value: number;
};

export function MonthlySummaryPieChart({
	rows,
	year,
	defaultMonthIndex = null,
	showPeriodSelect = true,
}: MonthlySummaryPieChartProps) {
	const defaultPeriod =
		typeof defaultMonthIndex === "number"
			? `month-${defaultMonthIndex}`
			: "year";
	const [selectedPeriod, setSelectedPeriod] = useState<string>(defaultPeriod);
	useEffect(() => {
		setSelectedPeriod(defaultPeriod);
	}, [defaultPeriod]);
	const periodOptions = useMemo(
		() => [
			{ value: "year", label: `Year (${year})` },
			...MONTH_LABELS.map((label, index) => ({
				value: `month-${index}`,
				label: `${label} ${year}`,
			})),
		],
		[year],
	);
	const activePeriod = showPeriodSelect ? selectedPeriod : defaultPeriod;
	const selectedOption =
		periodOptions.find((option) => option.value === activePeriod) ??
		periodOptions[0];
	const monthMatch = selectedOption.value.match(/^month-(\d{1,2})$/);
	const monthIndex = monthMatch ? Number(monthMatch[1]) : null;
	const activeMonthIndex =
		typeof monthIndex === "number" && Number.isFinite(monthIndex)
			? monthIndex
			: null;
	const { categoryData } = useCategoryBreakdownData(
		rows,
		year,
		activeMonthIndex,
	);
	const pieData: CategoryPieDatum[] = categoryData
		.filter((category) => category.total > 0)
		.map((category, index) => ({
			key: `slice-${index}`,
			label: category.category,
			value: category.total,
		}));
	const hasData = pieData.length > 0;

	const config = Object.fromEntries(
		pieData.map((month, index) => [
			month.key,
			{
				label: month.label,
				color: PIE_COLORS[index % PIE_COLORS.length],
			},
		]),
	);
	const legendPayload = pieData.map((month) => ({
		value: month.label,
		dataKey: month.key,
		color: `var(--color-${month.key})`,
	}));

	return (
		<div className="mt-6">
			<div className="flex flex-wrap items-start justify-between gap-3">
				<div>
					<h3 className="text-sm font-semibold text-slate-900">
						Category breakdown
					</h3>
					<p className="text-xs text-slate-500">
						Share of spend for {selectedOption.label}.
					</p>
				</div>
				{showPeriodSelect ? (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="sm" className="gap-2">
								{selectedOption.label}
								<ChevronDown className="size-4 text-slate-500" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-44">
							<DropdownMenuRadioGroup
								value={selectedOption.value}
								onValueChange={setSelectedPeriod}
							>
								{periodOptions.map((option) => (
									<DropdownMenuRadioItem
										key={option.value}
										value={option.value}
									>
										{option.label}
									</DropdownMenuRadioItem>
								))}
							</DropdownMenuRadioGroup>
						</DropdownMenuContent>
					</DropdownMenu>
				) : null}
			</div>
			<div className="mt-3">
				{hasData ? (
					<ChartContainer config={config} className="h-64 w-full">
						<PieChart margin={{ top: 8, bottom: 8 }}>
							<ChartTooltip
								content={
									<ChartTooltipContent
										indicator="dot"
										formatter={(value) =>
											formatCurrency(Number(value))
										}
									/>
								}
							/>
							<ChartLegend
								payload={legendPayload}
								content={<ChartLegendContent config={config} />}
							/>
							<Pie
								data={pieData}
								dataKey="value"
								nameKey="label"
								innerRadius={56}
								outerRadius={90}
								paddingAngle={2}
							>
								{pieData.map((entry) => (
									<Cell
										key={entry.key}
										fill={`var(--color-${entry.key})`}
									/>
								))}
							</Pie>
						</PieChart>
					</ChartContainer>
				) : (
					<div className="rounded-md border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
						No categorized expenses for this period.
					</div>
				)}
			</div>
		</div>
	);
}
