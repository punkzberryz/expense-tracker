import {
	CalendarDaysIcon,
	ReceiptTextIcon,
	TargetIcon,
	WalletCardsIcon,
} from "lucide-react";
import { formatCurrency } from "@/lib/format";
import type { DashboardData } from "./dashboard-data";
import { DashboardStatCard } from "./dashboard-stat-card";

type DashboardOverviewCardsProps = {
	data: DashboardData;
};

export function DashboardOverviewCards({ data }: DashboardOverviewCardsProps) {
	return (
		<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
			<DashboardStatCard
				eyebrow="Transactions"
				value={String(data.totalTransactions)}
				detail={`${data.monthsWithSpend} active months in ${data.focusYear}`}
				icon={<ReceiptTextIcon className="size-5" />}
				tone="amber"
			/>
			<DashboardStatCard
				eyebrow="Average Purchase"
				value={formatCurrency(data.averageTransaction)}
				detail="Typical spend per recorded expense"
				icon={<WalletCardsIcon className="size-5" />}
				tone="slate"
			/>
			<DashboardStatCard
				eyebrow="Active Days"
				value={String(data.activeDays)}
				detail="Days with at least one recorded expense"
				icon={<CalendarDaysIcon className="size-5" />}
				tone="teal"
			/>
			<DashboardStatCard
				eyebrow="Largest Purchase"
				value={
					data.largestExpense
						? formatCurrency(data.largestExpense.amount)
						: formatCurrency(0)
				}
				detail={
					data.largestExpense
						? `${data.largestExpense.name} on ${data.largestExpense.date}`
						: "No valid dated expenses yet"
				}
				icon={<TargetIcon className="size-5" />}
				tone="amber"
			/>
		</div>
	);
}
