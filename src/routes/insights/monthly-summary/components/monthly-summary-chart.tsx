import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { formatCurrency } from "@/lib/format";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import type { MonthlyDatum } from "./monthly-summary-data";

type MonthlySummaryChartProps = {
	monthlyData: MonthlyDatum[];
};

export function MonthlySummaryChart({ monthlyData }: MonthlySummaryChartProps) {
	return (
		<div className="mt-6">
			<ChartContainer
				config={{
					total: { label: "Spend", color: "var(--color-chart-1)" },
				}}
				className="h-48 w-full"
			>
				<BarChart data={monthlyData} margin={{ left: 8, right: 8 }}>
					<XAxis
						dataKey="month"
						tickLine={false}
						axisLine={false}
						tickMargin={8}
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
						radius={[4, 4, 0, 0]}
					/>
				</BarChart>
			</ChartContainer>
		</div>
	);
}
