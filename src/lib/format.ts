const currencyFormatter = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
});

export const formatCurrency = (amount: number) =>
	currencyFormatter.format(amount);

import { format, isMatch, isValid, parseISO } from "date-fns";

export const parseYearMonth = (value: string) => {
	if (!isMatch(value, "yyyy-MM-dd")) return null;
	const parsed = parseISO(value);
	if (!isValid(parsed)) return null;
	return {
		year: String(parsed.getFullYear()),
		monthIndex: parsed.getMonth(),
	};
};

export const parseYearDay = (value: string) => {
	if (!isMatch(value, "yyyy-MM-dd")) return null;
	const parsed = parseISO(value);
	if (!isValid(parsed)) return null;
	return { year: String(parsed.getFullYear()) };
};

export const formatShortDate = (value: string) => {
	if (!isMatch(value, "yyyy-MM-dd")) return value;
	const parsed = parseISO(value);
	if (!isValid(parsed)) return value;
	return format(parsed, "MMM d");
};
