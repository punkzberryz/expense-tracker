import type { ReactNode } from "react";
import {
	ActivityIcon,
	CalendarIcon,
	SparklesIcon,
	WalletIcon,
} from "lucide-react";
import { formatCurrency } from "@/lib/format";
import { formatShortDate, MONTH_LABELS } from "./trend-line-data";

type TrendLineHeaderProps = {
	year: string;
	totalSpend: number;
	monthsWithSpend: number;
	averageActiveMonthSpend: number;
	peakMonthIndex: number;
	peakMonthTotal: number;
	highestDailySpend: number;
	highestDailySpendDate: string | null;
};

export function TrendLineHeader({
	year,
	totalSpend,
	monthsWithSpend,
	averageActiveMonthSpend,
	peakMonthIndex,
	peakMonthTotal,
	highestDailySpend,
	highestDailySpendDate,
}: TrendLineHeaderProps) {
	const peakLabel =
		peakMonthIndex >= 0
			? `${MONTH_LABELS[peakMonthIndex]} (${formatCurrency(peakMonthTotal)})`
			: "No peak month yet";
	const highestDayLabel = highestDailySpendDate
		? formatShortDate(highestDailySpendDate)
		: "No dated expenses";

	return (
		<section className="rounded-[28px] border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-teal-900 p-6 text-white shadow-sm">
			<div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
				<div className="max-w-3xl">
					<div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-200">
						<SparklesIcon className="size-3.5 text-amber-300" />
						Spend trajectory
					</div>
					<h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
						See where {year} accelerated, flattened out, or quietly spiked.
					</h2>
					<p className="mt-3 text-sm leading-6 text-slate-300 sm:text-base">
						The trend stays visible across all twelve months, and the daily view
						helps explain what actually drove each climb.
					</p>
				</div>
				<div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-slate-200 backdrop-blur">
					<p className="text-xs uppercase tracking-[0.16em] text-slate-300">
						Active-month average
					</p>
					<p className="mt-2 text-2xl font-semibold text-white">
						{formatCurrency(averageActiveMonthSpend)}
					</p>
					<p className="mt-1 text-xs text-slate-300">
						Across {monthsWithSpend} month{monthsWithSpend === 1 ? "" : "s"} with
						recorded spend
					</p>
				</div>
			</div>
			<div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
				<TrendMetricCard
					icon={<WalletIcon className="size-4 text-amber-300" />}
					label="Recorded spend"
					value={formatCurrency(totalSpend)}
					description={`All dated expenses captured in ${year}.`}
				/>
				<TrendMetricCard
					icon={<CalendarIcon className="size-4 text-teal-200" />}
					label="Active months"
					value={String(monthsWithSpend)}
					description={`Average ${formatCurrency(averageActiveMonthSpend)} per active month.`}
				/>
				<TrendMetricCard
					icon={<SparklesIcon className="size-4 text-sky-200" />}
					label="Peak month"
					value={peakMonthIndex >= 0 ? MONTH_LABELS[peakMonthIndex] : "No data"}
					description={peakLabel}
				/>
				<TrendMetricCard
					icon={<ActivityIcon className="size-4 text-rose-200" />}
					label="Highest day"
					value={highestDayLabel}
					description={
						highestDailySpendDate
							? `${formatCurrency(highestDailySpend)} spent on the busiest day.`
							: "No daily activity available yet."
					}
				/>
			</div>
		</section>
	);
}

function TrendMetricCard({
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
			<div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-slate-300">
				{icon}
				<span>{label}</span>
			</div>
			<div className="mt-3 text-2xl font-semibold tracking-tight text-white">
				{value}
			</div>
			<p className="mt-2 text-sm leading-5 text-slate-300">{description}</p>
		</div>
	);
}
