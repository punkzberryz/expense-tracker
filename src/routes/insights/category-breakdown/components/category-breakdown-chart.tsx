import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { formatCurrency } from "@/lib/format";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import type { CategoryDatum } from "./category-breakdown-data";

type CategoryBreakdownChartProps = {
	categoryData: CategoryDatum[];
};

export function CategoryBreakdownChart({
	categoryData,
}: CategoryBreakdownChartProps) {
	return (
		<div className="mt-6">
			<ChartContainer
				config={{
					total: { label: "Spend", color: "var(--color-chart-1)" },
				}}
				className="h-72 w-full"
			>
				<BarChart
					data={categoryData}
					layout="vertical"
					margin={{ left: 16, right: 16, top: 4, bottom: 4 }}
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
						width={120}
						className="text-xs text-slate-500"
					/>
					<ChartTooltip
						cursor={{ fill: "rgba(15, 23, 42, 0.08)" }}
						content={
							<ChartTooltipContent
								indicator="dot"
								formatter={(value) => formatCurrency(Number(value))}
							/>
						}
					/>
					<Bar
						dataKey="total"
						name="Spend"
						fill="var(--color-total)"
						radius={[0, 4, 4, 0]}
					/>
				</BarChart>
			</ChartContainer>
		</div>
	);
}
