type TrendLineEmptyProps = {
	title?: string;
	description: string;
};

export function TrendLineEmpty({
	title = "Trend line",
	description,
}: TrendLineEmptyProps) {
	return (
		<section className="rounded-[28px] border border-dashed border-slate-300 bg-white/80 p-8 shadow-sm backdrop-blur">
			<h2 className="text-xl font-semibold tracking-tight text-slate-950">
				{title}
			</h2>
			<p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
				{description}
			</p>
		</section>
	);
}
