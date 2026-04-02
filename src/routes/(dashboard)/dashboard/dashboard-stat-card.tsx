import type { ReactNode } from "react";

type DashboardStatCardProps = {
	eyebrow: string;
	value: string;
	detail: string;
	icon: ReactNode;
	tone?: "slate" | "amber" | "teal";
};

const toneClassNames = {
	slate: "bg-slate-950 text-white ring-slate-800",
	amber: "bg-amber-100 text-amber-700 ring-amber-200",
	teal: "bg-teal-100 text-teal-700 ring-teal-200",
};

export function DashboardStatCard({
	eyebrow,
	value,
	detail,
	icon,
	tone = "slate",
}: DashboardStatCardProps) {
	return (
		<div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
			<div className="flex items-start justify-between gap-3">
				<div>
					<p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
						{eyebrow}
					</p>
					<p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
						{value}
					</p>
				</div>
				<div
					className={`flex size-10 items-center justify-center rounded-2xl ring-1 ${toneClassNames[tone]}`}
				>
					{icon}
				</div>
			</div>
			<p className="mt-3 text-sm text-slate-600">{detail}</p>
		</div>
	);
}
