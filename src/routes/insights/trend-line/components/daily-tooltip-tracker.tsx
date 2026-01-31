import { ExpenseRow } from "@/data/google-sheets";
import { formatCurrency } from "@/lib/format";
import { useEffect } from "react";
import { TooltipProps } from "recharts";
import {
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
    <div className="mt-3 rounded-md border border-slate-200 bg-white p-3 text-xs text-slate-600">
      <div className="font-semibold text-slate-900">
        {formatShortDate(date)}
      </div>
      {rows.length === 0 ? (
        <div className="mt-2 text-slate-500">No purchases recorded.</div>
      ) : (
        <div className="mt-2 space-y-1">
          {rows.map((row, index) => (
            <div
              key={`${row.date}-${row.name}-${index}`}
              className="flex items-center justify-between gap-2"
            >
              <div className="truncate">
                {row.name}
                {row.category ? ` · ${row.category}` : ""}
              </div>
              <div className="font-medium">{formatCurrency(row.amount)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
const formatShortDate = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const [, month, day] = value.split("-");
  const monthIndex = Number(month) - 1;
  const label = MONTH_LABELS[monthIndex] ?? month;
  return `${label} ${Number(day)}`;
};
const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
