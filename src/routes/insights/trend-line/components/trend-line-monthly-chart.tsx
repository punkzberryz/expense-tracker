import { Line, LineChart, XAxis, YAxis } from "recharts";
import { formatCurrency } from "@/lib/format";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";

type TrendLineMonthlyChartProps = {
	monthlyChartData: { month: string; spend: number }[];
};

export function TrendLineMonthlyChart({
	monthlyChartData,
}: TrendLineMonthlyChartProps) {
	return (
		<div className="mt-4">
			<ChartContainer
				config={{
					spend: { label: "Spend", color: "var(--color-chart-1)" },
				}}
				className="h-44 w-full"
			>
				<LineChart data={monthlyChartData} margin={{ left: 8, right: 8 }}>
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
						cursor={{ stroke: "var(--color-chart-1)", strokeWidth: 1 }}
						content={
							<ChartTooltipContent
								indicator="line"
								formatter={(value) => formatCurrency(Number(value))}
							/>
						}
					/>
					<Line
						type="monotone"
						dataKey="spend"
						name="Spend"
						stroke="var(--color-spend)"
						strokeWidth={2.5}
						dot={{ r: 3 }}
					/>
				</LineChart>
			</ChartContainer>
		</div>
	);
}
