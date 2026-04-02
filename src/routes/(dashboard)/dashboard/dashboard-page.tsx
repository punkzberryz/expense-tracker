import type { ExpenseRow } from "@/data/google-sheets";
import { buildDashboardData } from "./dashboard-data";
import { DashboardCategoryPanel } from "./dashboard-category-panel";
import { DashboardEmpty } from "./dashboard-empty";
import { DashboardHero } from "./dashboard-hero";
import { DashboardOverviewCards } from "./dashboard-overview-cards";
import { DashboardQuickLinks } from "./dashboard-quick-links";
import { DashboardRecentTransactions } from "./dashboard-recent-transactions";
import { DashboardSpendChart } from "./dashboard-spend-chart";

type DashboardPageProps = {
	availableYears: string[];
	focusYear: string | null;
	googleSheetUrl: string;
	rows: ExpenseRow[];
};

export function DashboardPage({
	availableYears,
	focusYear,
	googleSheetUrl,
	rows,
}: DashboardPageProps) {
	if (!focusYear) {
		return (
			<DashboardEmpty
				focusYear={focusYear}
				availableYears={availableYears}
				googleSheetUrl={googleSheetUrl}
			/>
		);
	}

	const data = buildDashboardData(rows, focusYear, availableYears);

	if (data.totalTransactions === 0) {
		return (
			<DashboardEmpty
				focusYear={focusYear}
				availableYears={availableYears}
				googleSheetUrl={googleSheetUrl}
			/>
		);
	}

	return (
		<div className="min-h-full bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.12),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(20,184,166,0.12),_transparent_28%)] p-6">
			<div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
				<DashboardHero data={data} googleSheetUrl={googleSheetUrl} />
				<DashboardOverviewCards data={data} />
				<div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.9fr)]">
					<DashboardSpendChart data={data} />
					<DashboardCategoryPanel data={data} />
				</div>
				<div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.9fr)]">
					<DashboardRecentTransactions data={data} />
					<DashboardQuickLinks data={data} />
				</div>
			</div>
		</div>
	);
}
