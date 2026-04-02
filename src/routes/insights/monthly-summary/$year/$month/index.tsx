import { createFileRoute, Link } from "@tanstack/react-router";
import {
	ArrowRightIcon,
	CalendarRangeIcon,
	SparklesIcon,
	TablePropertiesIcon,
	WalletIcon,
} from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { getAvailableYears, getExpenseRows } from "@/data/google-sheets";
import { formatCurrency, formatShortDate } from "@/lib/format";
import { ExpenseTable } from "@/routes/expense/components/expense-table";
import { MonthlySummaryEmpty } from "../../components/monthly-summary-empty";
import { useMonthlySummaryMonthDetailData } from "../../components/monthly-summary-month-detail-data";
import { MONTH_LABELS } from "../../components/monthly-summary-data";
import { MonthlySummaryPieChart } from "../../components/monthly-summary-pie-chart";

const percentFormatter = new Intl.NumberFormat("en-US", {
	style: "percent",
	maximumFractionDigits: 1,
});

export const Route = createFileRoute(
	"/insights/monthly-summary/$year/$month/",
)({
	loader: async ({ params }) => {
		const [rows, availableYears] = await Promise.all([
			getExpenseRows({ data: { year: params.year } }),
			getAvailableYears(),
		]);

		return { rows, availableYears };
	},
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = Route.useNavigate();
	const { rows, availableYears } = Route.useLoaderData();
	const { year, month } = Route.useParams();
	const monthNumber = Number(month);
	const monthIndex = Number.isInteger(monthNumber) ? monthNumber - 1 : Number.NaN;
	const isValidMonth = monthIndex >= 0 && monthIndex < 12;
	const monthLabel = isValidMonth ? MONTH_LABELS[monthIndex] : "Invalid";
	const selectedMonthParam = isValidMonth
		? String(monthIndex + 1).padStart(2, "0")
		: "";
	const monthOptions = MONTH_LABELS.map((label, index) => ({
		label,
		value: String(index + 1).padStart(2, "0"),
	}));
	const {
		monthRows,
		totalSpend,
		totalTransactions,
		activeDays,
		averageTransaction,
		averageDailySpend,
		shareOfYear,
		topCategory,
		largestExpense,
		latestExpense,
	} = useMonthlySummaryMonthDetailData(
		rows,
		year,
		Number.isInteger(monthIndex) ? monthIndex : -1,
	);

	const handleMonthChange = (nextMonth: string) => {
		if (!nextMonth || nextMonth === selectedMonthParam) return;
		navigate({
			to: "/insights/monthly-summary/$year/$month",
			params: { year, month: nextMonth },
		});
	};

	const handleYearChange = (nextYear: string) => {
		if (!nextYear || nextYear === year) return;
		navigate({
			to: "/insights/monthly-summary/$year/$month",
			params: {
				year: nextYear,
				month: selectedMonthParam || "01",
			},
		});
	};

	const selectors = (
		<div className="flex flex-wrap gap-3">
			{availableYears.length > 0 ? (
				<Select value={year} onValueChange={handleYearChange}>
					<SelectTrigger className="h-10 w-[9rem] rounded-full border-slate-300 bg-white text-slate-700 shadow-sm">
						<SelectValue placeholder="Select year" />
					</SelectTrigger>
					<SelectContent align="end">
						{availableYears.map((availableYear) => (
							<SelectItem key={availableYear} value={availableYear}>
								{availableYear}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			) : null}
			<Select value={isValidMonth ? selectedMonthParam : undefined} onValueChange={handleMonthChange}>
				<SelectTrigger className="h-10 w-[10rem] rounded-full border-slate-300 bg-white text-slate-700 shadow-sm">
					<SelectValue placeholder="Select month" />
				</SelectTrigger>
				<SelectContent align="end">
					{monthOptions.map((option) => (
						<SelectItem key={option.value} value={option.value}>
							{option.label} {year}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);

	if (!isValidMonth) {
		return (
			<div className="min-h-full bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.14),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(236,72,153,0.1),_transparent_26%)] p-6">
				<div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
					<section className="rounded-[28px] border border-slate-200 bg-gradient-to-br from-amber-50 via-white to-rose-50 p-6 shadow-sm">
						<div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
							<div>
								<div className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/80 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-600 shadow-sm backdrop-blur">
									<CalendarRangeIcon className="size-3.5 text-amber-500" />
									Month drilldown
								</div>
								<h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
									Choose a valid month
								</h1>
								<p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
									Pick a month between January and December to inspect its
									category mix and transactions.
								</p>
							</div>
							<div className="flex flex-wrap gap-3">
								{selectors}
								<Link
									to="/insights/monthly-summary/$year"
									params={{ year }}
									className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
								>
									<TablePropertiesIcon className="size-4" />
									Yearly summary
								</Link>
							</div>
						</div>
					</section>
					<MonthlySummaryEmpty
						title="Invalid month"
						description="Select a month between 01 and 12."
					/>
				</div>
			</div>
		);
	}

	const emptyMonth = totalSpend <= 0;

	return (
		<div className="min-h-full bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.14),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(236,72,153,0.1),_transparent_26%)] p-6">
			<div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
				<section className="rounded-[28px] border border-slate-200 bg-gradient-to-br from-amber-50 via-white to-rose-50 p-6 shadow-sm">
					<div className="grid gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.7fr)]">
						<div>
							<div className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/80 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-600 shadow-sm backdrop-blur">
								<SparklesIcon className="size-3.5 text-amber-500" />
								Month drilldown
							</div>
							<h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
								{monthLabel} {year}
							</h1>
							<p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
								Focus on one month at a time to see which categories led the
								spend, how dense the activity was, and which purchases stand out.
							</p>
							<div className="mt-6 flex flex-wrap gap-3">
								{selectors}
								<Link
									to="/insights/monthly-summary/$year"
									params={{ year }}
									className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
								>
									<TablePropertiesIcon className="size-4" />
									Yearly summary
								</Link>
								<Link
									to="/expense/$year"
									params={{ year }}
									className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
								>
									View raw data
									<ArrowRightIcon className="size-4" />
								</Link>
							</div>
						</div>
						<div className="rounded-[24px] border border-white/80 bg-white/85 p-5 shadow-sm backdrop-blur">
							<p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
								{monthLabel} snapshot
							</p>
							<p className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
								{formatCurrency(totalSpend)}
							</p>
							<p className="mt-2 text-sm text-slate-600">
								{percentFormatter.format(shareOfYear)} of {year}'s recorded spend.
							</p>
							<div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
								<div className="rounded-2xl bg-slate-950 p-4 text-white">
									<p className="text-xs uppercase tracking-[0.16em] text-slate-300">
										Top category
									</p>
									<p className="mt-2 text-xl font-semibold">
										{topCategory?.category ?? "No category"}
									</p>
									<p className="mt-1 text-sm text-slate-300">
										{topCategory
											? `${formatCurrency(topCategory.total)} / ${percentFormatter.format(topCategory.share)} of the month`
											: "No categorized expenses recorded."}
									</p>
								</div>
								<div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
									<p className="text-xs uppercase tracking-[0.16em] text-slate-500">
										Latest purchase
									</p>
									<p className="mt-2 text-base font-semibold text-slate-950">
										{latestExpense ? latestExpense.name : "No purchases"}
									</p>
									<p className="mt-1 text-sm text-slate-600">
										{latestExpense
											? `${formatCurrency(latestExpense.amount)} on ${formatShortDate(latestExpense.date)}`
											: "Nothing recorded for this month yet."}
									</p>
								</div>
							</div>
						</div>
					</div>
				</section>

				{emptyMonth ? (
					<MonthlySummaryEmpty
						title={`${monthLabel} ${year} has no recorded spend`}
						description="No dated expenses were found for this month. Try a different month or return to the yearly summary."
					/>
				) : (
					<>
						<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
							<MonthMetricCard
								label="Transactions"
								value={String(totalTransactions)}
								description="Purchases recorded during this month."
								tone="amber"
							/>
							<MonthMetricCard
								label="Active days"
								value={String(activeDays)}
								description="Days that captured at least one expense."
								tone="rose"
							/>
							<MonthMetricCard
								label="Avg purchase"
								value={formatCurrency(averageTransaction)}
								description="Average amount per transaction."
								tone="sky"
							/>
							<MonthMetricCard
								label="Avg active day"
								value={formatCurrency(averageDailySpend)}
								description="Average spend across days with activity."
								tone="slate"
							/>
						</div>

						<div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
							<MonthlySummaryPieChart
								rows={rows}
								year={year}
								defaultMonthIndex={monthIndex}
								showPeriodSelect={false}
							/>
							<section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
								<p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
									Month notes
								</p>
								<div className="mt-4 space-y-4">
									<InsightNote
										label="Largest purchase"
										value={
											largestExpense
												? formatCurrency(largestExpense.amount)
												: formatCurrency(0)
										}
										description={
											largestExpense
												? `${largestExpense.name} on ${formatShortDate(largestExpense.date)}`
												: "No purchases recorded."
										}
									/>
									<InsightNote
										label="Top category"
										value={topCategory?.category ?? "No category"}
										description={
											topCategory
												? `${formatCurrency(topCategory.total)} across ${topCategory.count} purchase${topCategory.count === 1 ? "" : "s"}`
												: "Nothing categorized for this month."
										}
									/>
									<InsightNote
										label="Monthly weight"
										value={percentFormatter.format(shareOfYear)}
										description={`Share of ${year}'s total recorded spend.`}
									/>
									<div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
										Use the table below to filter by description or category once
										you know which purchases you want to inspect.
									</div>
								</div>
							</section>
						</div>

						<section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
							<div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
								<div>
									<h2 className="text-lg font-semibold text-slate-950">
										Transactions for {monthLabel} {year}
									</h2>
									<p className="mt-1 text-sm leading-6 text-slate-600">
										Filter the raw purchases to trace exactly what pushed this
										month higher or kept it quiet.
									</p>
								</div>
								<div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
									<WalletIcon className="size-3.5" />
									{totalTransactions} purchase{totalTransactions === 1 ? "" : "s"}
								</div>
							</div>
							<div className="mt-5">
								<ExpenseTable
									rows={monthRows}
									emptyMessage="No expenses found for this month."
								/>
							</div>
						</section>
					</>
				)}
			</div>
		</div>
	);
}

function MonthMetricCard({
	label,
	value,
	description,
	tone,
}: {
	label: string;
	value: string;
	description: string;
	tone: "amber" | "rose" | "sky" | "slate";
}) {
	const toneClasses = {
		amber: "border-amber-200 bg-amber-50/80",
		rose: "border-rose-200 bg-rose-50/80",
		sky: "border-sky-200 bg-sky-50/80",
		slate: "border-slate-200 bg-white",
	};

	return (
		<div className={`rounded-[24px] border p-4 shadow-sm ${toneClasses[tone]}`}>
			<p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
				{label}
			</p>
			<p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
				{value}
			</p>
			<p className="mt-2 text-sm leading-5 text-slate-600">{description}</p>
		</div>
	);
}

function InsightNote({
	label,
	value,
	description,
}: {
	label: string;
	value: string;
	description: string;
}) {
	return (
		<div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
			<p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
				{label}
			</p>
			<p className="mt-2 text-xl font-semibold tracking-tight text-slate-950">
				{value}
			</p>
			<p className="mt-1 text-sm leading-5 text-slate-600">{description}</p>
		</div>
	);
}
