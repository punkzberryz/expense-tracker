import { useEffect } from "react";
import type { TooltipProps } from "recharts";
import type {
	NameType,
	ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import type { ExpenseRow } from "@/data/google-sheets";
import { formatCurrency, formatShortDate } from "@/lib/format";

export const DailyTooltipTracker = ({
	active,
	payload,
	onHover,
}: TooltipProps<ValueType, NameType> & {
	onHover: (date: string | null) => void;
}) => {
	const date = String(payload?.[0]?.payload?.date ?? "");

	useEffect(() => {
		if (active && payload && payload.length) {
			onHover(date || null);
		}
	}, [active, date, onHover, payload]);

	if (!active || !payload?.length) return null;

	return (
		<div className="rounded-2xl border border-slate-200 bg-white/95 p-3 text-xs text-slate-700 shadow-xl backdrop-blur">
			<div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
				{formatShortDate(date)}
			</div>
			<div className="mt-2 space-y-1.5">
				{payload.map((entry) => {
					const label = String(entry.name ?? entry.dataKey ?? "");
					const value = Number(entry.value ?? 0);
					return (
						<div key={label} className="flex items-center gap-2">
							<span
								className="inline-block size-2 rounded-full"
								style={{ backgroundColor: entry.color }}
							/>
							<span className="flex-1 text-slate-600">{label}</span>
							<span className="font-medium text-slate-900">
								{formatCurrency(value)}
							</span>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export const DailyPurchasePanel = ({
	date,
	rows,
	latestDate,
}: {
	date: string | null;
	rows: ExpenseRow[];
	latestDate: string | null;
}) => {
	const total = rows.reduce((sum, row) => sum + row.amount, 0);

	if (!date) {
		return (
			<aside className="flex h-[32rem] rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500">
				<div className="flex flex-1 items-center justify-center text-center">
					Hover a bar to see purchases for that day.
				</div>
			</aside>
		);
	}

	return (
		<aside className="flex h-[32rem] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
			<div className="flex items-start justify-between gap-4">
				<div>
					<div className="flex flex-wrap items-center gap-2">
						<h4 className="text-lg font-semibold tracking-tight text-slate-950">
							{formatShortDate(date)}
						</h4>
						{latestDate === date ? (
							<span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-medium text-amber-800">
								Latest recorded day
							</span>
						) : null}
					</div>
					<p className="mt-2 text-sm leading-6 text-slate-600">
						Review the individual purchases that shaped this point on the running
						total.
					</p>
				</div>
				<div className="text-right">
					<div className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
						Day total
					</div>
					<div className="mt-2 text-xl font-semibold text-slate-950">
						{formatCurrency(total)}
					</div>
					<div className="mt-1 text-xs text-slate-500 tabular-nums">
						{rows.length} item{rows.length === 1 ? "" : "s"}
					</div>
				</div>
			</div>

			{rows.length === 0 ? (
				<div className="mt-4 flex flex-1 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-center text-sm text-slate-500">
					No purchases recorded for this date.
				</div>
			) : (
				<div className="mt-4 flex-1 overflow-y-auto pr-1">
					<div className="divide-y divide-slate-100">
						{rows.map((row, index) => (
							<div
								key={`${row.date}-${row.name}-${index}`}
								className="py-3 first:pt-0 last:pb-0"
							>
								<div className="flex items-start justify-between gap-3">
									<div className="min-w-0">
										<div className="flex min-w-0 items-center gap-2">
											<div className="truncate text-[13px] font-medium text-slate-900">
												{row.name}
											</div>
											{row.category ? (
												<span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
													{row.category}
												</span>
											) : null}
										</div>
										{row.description ? (
											<p className="mt-0.5 line-clamp-2 text-[12px] leading-5 text-slate-500">
												{row.description}
											</p>
										) : null}
									</div>
									<div className="shrink-0 text-right text-[13px] font-semibold tabular-nums text-slate-900">
										{formatCurrency(row.amount)}
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</aside>
	);
};
