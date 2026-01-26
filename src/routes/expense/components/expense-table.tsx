import { formatCurrency } from "@/lib/format";
import {
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	sortingFns,
	useReactTable,
} from "@tanstack/react-table";
import { compareItems, rankItem } from "@tanstack/match-sorter-utils";
import { useEffect, useMemo, useState } from "react";

import type {
	Column,
	ColumnDef,
	ColumnFiltersState,
	FilterFn,
	SortingFn,
} from "@tanstack/react-table";
import type { RankingInfo } from "@tanstack/match-sorter-utils";
import type { ExpenseRow } from "@/data/google-sheets";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

declare module "@tanstack/react-table" {
	interface FilterFns {
		fuzzy: FilterFn<unknown>;
	}
	interface FilterMeta {
		itemRank: RankingInfo;
	}
}

const fuzzyFilter: FilterFn<ExpenseRow> = (
	row,
	columnId,
	value,
	addMeta,
) => {
	const itemRank = rankItem(String(row.getValue(columnId)), value);
	addMeta({ itemRank });
	return itemRank.passed;
};

const fuzzySort: SortingFn<ExpenseRow> = (rowA, rowB, columnId) => {
	let dir = 0;
	const metaA = rowA.columnFiltersMeta[columnId];
	const metaB = rowB.columnFiltersMeta[columnId];
	if (metaA?.itemRank && metaB?.itemRank) {
		dir = compareItems(metaA.itemRank, metaB.itemRank);
	}
	return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir;
};

type ExpenseTableProps = {
	rows: ExpenseRow[];
};

export function ExpenseTable({ rows }: ExpenseTableProps) {
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [globalFilter, setGlobalFilter] = useState("");
	const [pageSizeSelection, setPageSizeSelection] = useState<number>(10);

	const columns = useMemo<ColumnDef<ExpenseRow>[]>(
		() => [
			{
				accessorKey: "date",
				header: "Date",
				sortingFn: "alphanumeric",
			},
			{
				accessorKey: "name",
				header: "Name",
				filterFn: "includesString",
			},
			{
				accessorKey: "category",
				header: "Category",
				filterFn: "fuzzy",
				sortingFn: fuzzySort,
				enableGlobalFilter: true,
			},
			{
				accessorKey: "type",
				header: "Type",
				filterFn: "equalsString",
			},
			{
				accessorKey: "amount",
				header: () => <div className="text-right">Amount</div>,
				cell: ({ getValue }) => (
					<div className="text-right">
						{formatCurrency(getValue<number>())}
					</div>
				),
			},
			{
				accessorKey: "description",
				header: "Description",
				filterFn: "fuzzy",
				sortingFn: fuzzySort,
				enableGlobalFilter: true,
			},
		],
		[],
	);

	const table = useReactTable({
		data: rows,
		columns,
		filterFns: {
			fuzzy: fuzzyFilter,
		},
		state: {
			columnFilters,
			globalFilter,
		},
		onColumnFiltersChange: setColumnFilters,
		onGlobalFilterChange: setGlobalFilter,
		globalFilterFn: "fuzzy",
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	});

	useEffect(() => {
		const { columnFilters, sorting } = table.getState();
		const active = columnFilters[0]?.id;
		if (active === "category" || active === "description") {
			if (!sorting[0]) {
				table.setSorting([{ id: active, desc: false }]);
			}
		}
	}, [table]);

	useEffect(() => {
		if (pageSizeSelection === -1) {
			table.setPageSize(rows.length || 1);
		} else {
			table.setPageSize(pageSizeSelection);
		}
	}, [pageSizeSelection, rows.length, table]);

	return (
		<div className="space-y-4">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<DebouncedInput
					value={globalFilter ?? ""}
					onChange={(value) => setGlobalFilter(String(value))}
					placeholder="Search description or category..."
					className="w-full max-w-md rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
				/>
				<div className="text-sm text-slate-500">
					{table.getFilteredRowModel().rows.length} results
				</div>
			</div>

			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id}>
										<div className="space-y-2">
											<button
												type="button"
												className={
													header.column.getCanSort()
														? "cursor-pointer select-none text-left"
														: "text-left"
												}
												onClick={header.column.getToggleSortingHandler()}
												disabled={!header.column.getCanSort()}
											>
												{header.isPlaceholder
													? null
													: flexRender(
															header.column.columnDef.header,
															header.getContext(),
														)}
												{{
													asc: " ↑",
													desc: " ↓",
												}[header.column.getIsSorted() as string] ?? null}
											</button>
											{header.column.getCanFilter() ? (
												<ColumnFilter column={header.column} />
											) : null}
										</div>
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow key={row.id}>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className="h-24 text-center">
									No expenses found for this year.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			<div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
				<button
					type="button"
					className="rounded-md border px-3 py-1 disabled:opacity-50"
					onClick={() => table.setPageIndex(0)}
					disabled={!table.getCanPreviousPage()}
				>
					{"<<"}
				</button>
				<button
					type="button"
					className="rounded-md border px-3 py-1 disabled:opacity-50"
					onClick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}
				>
					{"<"}
				</button>
				<button
					type="button"
					className="rounded-md border px-3 py-1 disabled:opacity-50"
					onClick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}
				>
					{">"}
				</button>
				<button
					type="button"
					className="rounded-md border px-3 py-1 disabled:opacity-50"
					onClick={() => table.setPageIndex(table.getPageCount() - 1)}
					disabled={!table.getCanNextPage()}
				>
					{">>"}
				</button>
				<span>
					Page {table.getState().pagination.pageIndex + 1} of{" "}
					{table.getPageCount()}
				</span>
				<span className="flex items-center gap-2">
					Go to page:
					<input
						type="number"
						min={1}
						max={Math.max(1, table.getPageCount())}
						defaultValue={table.getState().pagination.pageIndex + 1}
						onChange={(event) => {
							const page = event.target.value
								? Number(event.target.value) - 1
								: 0;
							table.setPageIndex(page);
						}}
						className="w-16 rounded-md border px-2 py-1"
					/>
				</span>
				<select
					value={pageSizeSelection}
					onChange={(event) => {
						setPageSizeSelection(Number(event.target.value));
					}}
					className="rounded-md border px-2 py-1"
				>
					{[10, 20, 30, 40, 50].map((pageSize) => (
						<option key={pageSize} value={pageSize}>
							Show {pageSize}
						</option>
					))}
					<option value={-1}>Show all</option>
				</select>
			</div>
		</div>
	);
}

function ColumnFilter({ column }: { column: Column<ExpenseRow, unknown> }) {
	const columnFilterValue = column.getFilterValue();

	if (column.id === "amount") return null;

	return (
		<DebouncedInput
			type="text"
			value={(columnFilterValue ?? "") as string}
			onChange={(value) => column.setFilterValue(value)}
			placeholder="Filter..."
			className="w-full rounded-md border border-slate-200 px-2 py-1 text-xs"
		/>
	);
}

function DebouncedInput({
	value: initialValue,
	onChange,
	debounce = 400,
	...props
}: {
	value: string | number;
	onChange: (value: string | number) => void;
	debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
	const [value, setValue] = useState(initialValue);

	useEffect(() => {
		setValue(initialValue);
	}, [initialValue]);

	useEffect(() => {
		const timeout = setTimeout(() => {
			onChange(value);
		}, debounce);

		return () => clearTimeout(timeout);
	}, [value, debounce, onChange]);

	return (
		<input
			{...props}
			value={value}
			onChange={(event) => setValue(event.target.value)}
		/>
	);
}
