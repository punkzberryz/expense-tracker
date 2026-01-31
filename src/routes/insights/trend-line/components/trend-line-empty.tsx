type TrendLineEmptyProps = {
	title?: string;
	description: string;
};

export function TrendLineEmpty({
	title = "Trend line",
	description,
}: TrendLineEmptyProps) {
	return (
		<div className="rounded-md border border-slate-200 bg-white p-4">
			<h2 className="text-lg font-semibold text-slate-900">{title}</h2>
			<p className="mt-2 text-sm text-slate-500">{description}</p>
		</div>
	);
}
