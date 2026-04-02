type CategoryBreakdownEmptyProps = {
	title?: string;
	description: string;
};

export function CategoryBreakdownEmpty({
	title = "Category breakdown",
	description,
}: CategoryBreakdownEmptyProps) {
	return (
		<section className="rounded-[28px] border border-dashed border-slate-300 bg-white/90 p-8 text-center shadow-sm">
			<h2 className="text-2xl font-semibold tracking-tight text-slate-950">
				{title}
			</h2>
			<p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
				{description}
			</p>
		</section>
	);
}
