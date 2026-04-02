import type { ReactNode } from "react";
import {
	ActivityIcon,
	CalendarRangeIcon,
	SparklesIcon,
	WalletIcon,
} from "lucide-react";
import { formatCurrency } from "@/lib/format";
import { MONTH_LABELS } from "./monthly-summary-data";

type MonthlySummaryHeaderProps = {
	year: string;
	totalSpend: number;
	monthsWithSpend: number;
	averageMonthlySpend: number;
	peakMonthIndex: number;
	peakMonthTotal: number;
};

export function MonthlySummaryHeader({
	year,
	totalSpend,
	monthsWithSpend,
	averageMonthlySpend,
	peakMonthIndex,
	peakMonthTotal,
}: MonthlySummaryHeaderProps) {
	const peakLabel =
		peakMonthIndex >= 0
			? `${MONTH_LABELS[peakMonthIndex]} (${formatCurrency(peakMonthTotal)})`
			: "No peak month yet";

	return (
		<section className="rounded-[28px] border border-slate-200 bg-gradient-to-br from-slate-950 via-emerald-950 to-sky-900 p-6 text-white shadow-sm">
			<div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
				<div className="max-w-3xl">
					<div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-emerald-100">
						<SparklesIcon className="size-3.5 text-amber-300" />
						Monthly cadence
					</div>
					<h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
						See how each month in {year} stacked up against the rest of the year.
					</h2>
					<p className="mt-3 text-sm leading-6 text-emerald-50/80 sm:text-base">
						Use the summary to compare total spend, find the busiest stretch,
						and jump straight into a month when something looks unusual.
					</p>
				</div>
				<div className="rounded-[24px] border border-white/15 bg-white/10 px-5 py-4 text-sm text-emerald-50/85 backdrop-blur">
					<p className="text-xs uppercase tracking-[0.16em] text-emerald-100/70">
						Recorded spend
					</p>
					<p className="mt-2 text-3xl font-semibold tracking-tight text-white">
						{formatCurrency(totalSpend)}
					</p>
					<p className="mt-2 text-sm text-emerald-50/75">
						Across {monthsWithSpend} active month
						{monthsWithSpend === 1 ? "" : "s"} with dated expenses
					</p>
					<p className="mt-1 text-xs text-emerald-100/65">
						Average active month: {formatCurrency(averageMonthlySpend)}
					</p>
				</div>
			</div>
			<div className="mt-6 grid gap-3 md:grid-cols-3">
				<SummaryCallout
					icon={<WalletIcon className="size-4 text-amber-300" />}
					label="Total for the year"
					value={formatCurrency(totalSpend)}
					description="Every dated expense recorded in the selected sheet."
				/>
				<SummaryCallout
					icon={<CalendarRangeIcon className="size-4 text-sky-200" />}
					label="Peak month"
					value={peakMonthIndex >= 0 ? MONTH_LABELS[peakMonthIndex] : "No data"}
					description={peakLabel}
				/>
				<SummaryCallout
					icon={<ActivityIcon className="size-4 text-emerald-200" />}
					label="Coverage"
					value={`${monthsWithSpend} / 12`}
					description="Months that captured at least one dated expense."
				/>
			</div>
		</section>
	);
}

function SummaryCallout({
	icon,
	label,
	value,
	description,
}: {
	icon: ReactNode;
	label: string;
	value: string;
	description: string;
}) {
	return (
		<div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
			<div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-emerald-100/70">
				{icon}
				<span>{label}</span>
			</div>
			<div className="mt-3 text-2xl font-semibold tracking-tight text-white">
				{value}
			</div>
			<p className="mt-2 text-sm leading-5 text-emerald-50/75">{description}</p>
		</div>
	);
}
