type MonthlySummaryEmptyProps = {
	title?: string;
	description: string;
};

export function MonthlySummaryEmpty({
	title = "Monthly summary",
	description,
}: MonthlySummaryEmptyProps) {
	return (
		<section className="rounded-[28px] border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-emerald-50 p-6 shadow-sm">
			<div className="max-w-2xl">
				<h2 className="text-2xl font-semibold tracking-tight text-slate-950">
					{title}
				</h2>
				<p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
			</div>
		</section>
	);
}
