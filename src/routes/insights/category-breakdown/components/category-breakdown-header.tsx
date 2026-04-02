import { WalletIcon } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import type { CategoryDatum } from "./category-breakdown-data";

const percentFormatter = new Intl.NumberFormat("en-US", {
	style: "percent",
	maximumFractionDigits: 1,
});

type CategoryBreakdownHeaderProps = {
	year: string;
	totalSpend: number;
	topCategory: CategoryDatum | null;
};

export function CategoryBreakdownHeader({
	year,
	totalSpend,
	topCategory,
}: CategoryBreakdownHeaderProps) {
	const topLabel = topCategory
		? `${topCategory.category} / ${formatCurrency(topCategory.total)}`
		: "No standout category yet";

	return (
		<section className="rounded-[28px] border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 p-6 text-white shadow-sm">
			<div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
				<div className="max-w-3xl">
					<div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-200">
						<WalletIcon className="size-3.5 text-sky-300" />
						Category pulse
					</div>
					<h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
						See where {year} concentrated your spending.
					</h2>
					<p className="mt-3 text-sm leading-6 text-slate-300 sm:text-base">
						Compare how much each category absorbed, identify the dominant one,
						and move straight into the purchases behind it.
					</p>
				</div>
				<div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-slate-200 backdrop-blur">
					<p className="text-xs uppercase tracking-[0.16em] text-slate-300">
						Total recorded spend
					</p>
					<p className="mt-2 text-2xl font-semibold text-white">
						{formatCurrency(totalSpend)}
					</p>
					<p className="mt-1 text-xs text-slate-300">{topLabel}</p>
				</div>
			</div>
			<div className="mt-6 grid gap-3 md:grid-cols-2">
				<div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
					<p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-300">
						Top category
					</p>
					<p className="mt-3 text-2xl font-semibold tracking-tight text-white">
						{topCategory?.category ?? "No data"}
					</p>
					<p className="mt-2 text-sm leading-5 text-slate-300">
						{topCategory
							? `${formatCurrency(topCategory.total)} across ${topCategory.count} purchase${
									topCategory.count === 1 ? "" : "s"
								}.`
							: "No category totals available yet."}
					</p>
				</div>
				<div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
					<p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-300">
						Share of annual spend
					</p>
					<p className="mt-3 text-2xl font-semibold tracking-tight text-white">
						{topCategory ? percentFormatter.format(topCategory.share) : "0%"}
					</p>
					<p className="mt-2 text-sm leading-5 text-slate-300">
						{topCategory
							? `${topCategory.category} is the largest slice of spending in ${year}.`
							: "Add categorized expenses to see the leading share."}
					</p>
				</div>
			</div>
		</section>
	);
}
