import { formatCurrency } from "@/lib/format";
import type { DashboardData } from "./dashboard-data";

type DashboardCategoryPanelProps = {
	data: DashboardData;
};

export function DashboardCategoryPanel({ data }: DashboardCategoryPanelProps) {
	return (
		<div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
			<p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
				Category leaders
			</p>
			<h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">
				What is driving spend this year
			</h2>
			{data.topCategory ? (
				<div className="mt-5 rounded-2xl bg-slate-950 p-4 text-white">
					<div className="flex items-end justify-between gap-4">
						<div>
							<p className="text-xs uppercase tracking-[0.16em] text-slate-300">
								Top category
							</p>
							<p className="mt-2 text-2xl font-semibold">{data.topCategory}</p>
						</div>
						<div className="text-right">
							<p className="text-lg font-semibold">
								{formatCurrency(data.topCategorySpend)}
							</p>
							<p className="text-xs text-slate-300">
								{(data.topCategoryShare * 100).toFixed(1)}% of total
							</p>
						</div>
					</div>
				</div>
			) : null}
			<div className="mt-5 space-y-4">
				{data.topCategories.map((category) => (
					<div key={category.category}>
						<div className="flex items-center justify-between gap-3">
							<div>
								<p className="text-sm font-medium text-slate-900">
									{category.category}
								</p>
								<p className="text-xs text-slate-500">
									{category.count} transactions
								</p>
							</div>
							<p className="text-sm font-medium text-slate-700">
								{formatCurrency(category.total)}
							</p>
						</div>
						<div className="mt-2 h-2 rounded-full bg-slate-100">
							<div
								className="h-full rounded-full bg-gradient-to-r from-amber-400 to-teal-500"
								style={{
									width: `${Math.max(category.share * 100, 6)}%`,
								}}
							/>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
