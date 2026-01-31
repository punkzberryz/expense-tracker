import type { ExpenseRow } from "@/data/google-sheets";
import { formatCurrency, formatShortDate } from "@/lib/format";
import { useEffect } from "react";
import type { TooltipProps } from "recharts";
import type {
	NameType,
	ValueType,
} from "recharts/types/component/DefaultTooltipContent";

export const DailyTooltipTracker = ({
	active,
	payload,
	onHover,
}: TooltipProps<ValueType, NameType> & {
	onHover: (date: string | null) => void;
}) => {
	useEffect(() => {
		if (active && payload && payload.length) {
			const date = String(payload[0]?.payload?.date ?? "");
			onHover(date || null);
		}
	}, [active, payload, onHover]);
	return null;
};
export const DailyPurchasePanel = ({
	date,
	rows,
}: {
	date: string | null;
	rows: ExpenseRow[];
}) => {
	if (!date) {
		return (
			<div className="mt-3 rounded-md border border-slate-200 bg-white p-3 text-xs text-slate-500">
				Hover a bar to see purchases for that day.
			</div>
		);
	}

	return (
		<div className="mt-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
			<div className="flex items-center justify-between">
				<div className="text-sm font-semibold text-slate-900">
					{formatShortDate(date)}
				</div>
				<div className="text-xs text-slate-500 tabular-nums">
					{rows.length} item{rows.length === 1 ? "" : "s"}
				</div>
			</div>

			{rows.length === 0 ? (
				<div className="mt-2 text-xs text-slate-500">
					No purchases recorded.
				</div>
			) : (
				<div className="mt-2 divide-y divide-slate-100">
					{rows.map((row, index) => (
						<div
							key={`${row.date}-${row.name}-${index}`}
							className="py-2 first:pt-0 last:pb-0"
						>
							<div className="flex items-start justify-between gap-3">
								<div className="min-w-0">
									<div className="flex items-center gap-2 min-w-0">
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
										<p className="mt-0.5 line-clamp-2 text-[12px] leading-4 text-slate-500">
											{row.description}
										</p>
									) : null}
								</div>

								<div className="shrink-0 text-right tabular-nums text-[13px] font-semibold text-slate-900">
									{formatCurrency(row.amount)}
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};
