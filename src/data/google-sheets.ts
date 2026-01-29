import { createServerFn } from "@tanstack/react-start";
import { google } from "googleapis";

const READ_SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];
const EXPENSE_HEADERS = [
	"Date",
	"Name",
	"Category",
	"Type",
	"Amount",
	"Description",
] as const;
const EXPENSE_CATEGORIES = [
	"Food",
	"Grocery",
	"Healthcare",
	"Other",
	"Entertainment",
	"Utility",
	"Transport",
	"Education",
	"Housing",
	"Dada's Toys",
	"Shopping",
] as const;
const EXPENSE_CATEGORY_SET = new Set(EXPENSE_CATEGORIES);

export type ExpenseRow = {
	date: string;
	name: string;
	category: string;
	type: string;
	amount: number;
	description: string;
};

export type ExpenseQuery = {
	year?: string | number;
};

type SheetMetadata = { properties?: { title?: string | null } | null };

const getSheetId = () => {
	const sheetId = process.env.GOOGLE_SHEET_ID;
	if (!sheetId) throw new Error("Missing GOOGLE_SHEET_ID.");
	return sheetId;
};
const getPrivateKey = () => {
	if (process.env.GOOGLE_SHEETS_PRIVATE_KEY_B64) {
		return Buffer.from(process.env.GOOGLE_SHEETS_PRIVATE_KEY_B64, "base64")
			.toString("utf8")
			.replace(/\\n/g, "\n");
	}
	if (process.env.GOOGLE_SHEETS_PRIVATE_KEY) {
		return process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, "\n");
	}
	return null;
};
const getGoogleSheetsAuth = (scopes: string[] = READ_SCOPES) => {
	const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
	const privateKey = getPrivateKey();
	if (!clientEmail || !privateKey) {
		throw new Error("Missing Google Sheets credentials.");
	}
	return new google.auth.JWT({ email: clientEmail, key: privateKey, scopes });
};

const normalizeYear = (year?: string | number) => {
	if (year === undefined || year === null || year === "") {
		return new Date().getFullYear().toString();
	}
	const value = String(year).trim();
	if (!/^\d{4}$/.test(value)) {
		throw new Error("Year must be a 4-digit value.");
	}
	return value;
};

const isYearSheet = (value: string) => /^\d{4}$/.test(value);

const normalizeCell = (value: unknown) =>
	typeof value === "string" ? value.trim() : String(value ?? "").trim();

const parseDateCell = (value: unknown) => {
	const raw = normalizeCell(value);
	if (!raw) return raw;
	const withoutTime = raw.split(",")[0]?.trim() ?? raw;
	if (/^\d{4}-\d{2}-\d{2}$/.test(withoutTime)) {
		return withoutTime;
	}
	const match = withoutTime.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
	if (!match) return withoutTime;
	const [, month, day, year] = match;
	return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
};

const parseHeaderRow = (row: unknown[]) => {
	const normalized = row.map(normalizeCell);
	const matches = EXPENSE_HEADERS.every(
		(header, index) => normalized[index] === header,
	);
	if (!matches) {
		throw new Error(
			`Unexpected header row. Expected: ${EXPENSE_HEADERS.join(", ")}.`,
		);
	}
};

const parseExpenseRow = (row: unknown[]): ExpenseRow | null => {
	const isEmpty = row.every((cell) => normalizeCell(cell).length === 0);
	if (isEmpty) return null;

	const category = normalizeCell(row[2]);
	const amountRaw = normalizeCell(row[4]);
	const amount = Number.parseFloat(amountRaw);
	if (!EXPENSE_CATEGORY_SET.has(category)) return null;
	if (Number.isNaN(amount) || amount <= 0) return null;

	return {
		date: parseDateCell(row[0]),
		name: normalizeCell(row[1]),
		category,
		type: normalizeCell(row[3]),
		amount,
		description: normalizeCell(row[5]),
	};
};

async function fetchExpenseRows(targetYear: string): Promise<ExpenseRow[]> {
	const auth = getGoogleSheetsAuth();
	const sheets = google.sheets({
		version: "v4",
		auth,
	});
	const sheetId = getSheetId();
	const metadata = await sheets.spreadsheets.get({
		spreadsheetId: sheetId,
		fields: "sheets(properties(title))",
	});
	const sheetExists = metadata.data.sheets?.some(
		(sheet) => sheet.properties?.title === targetYear,
	);

	if (!sheetExists) {
		throw new Error(`Google Sheets tab "${targetYear}" not found.`);
	}

	const response = await sheets.spreadsheets.values.get({
		spreadsheetId: sheetId,
		range: `${targetYear}!A:F`,
	});

	const rows = response.data.values ?? [];
	if (rows.length === 0) return [];
	const [headerRow, ...dataRows] = rows;
	parseHeaderRow(headerRow ?? []);

	return dataRows
		.map((row) => parseExpenseRow(row ?? []))
		.filter((row): row is ExpenseRow => row !== null);
}

async function fetchAvailableYears(): Promise<string[]> {
	const auth = getGoogleSheetsAuth();
	const sheets = google.sheets({
		version: "v4",
		auth,
	});
	const sheetId = getSheetId();
	const metadata = await sheets.spreadsheets.get({
		spreadsheetId: sheetId,
		fields: "sheets(properties(title))",
	});
	const titles = (metadata.data.sheets ?? [])
		.map((sheet: SheetMetadata) => sheet.properties?.title)
		.filter((title): title is string => typeof title === "string")
		.map((title) => title.trim())
		.filter((title) => title.length > 0);
	const years = Array.from(
		new Set(titles.filter((title) => isYearSheet(title))),
	);
	return years.sort((a, b) => Number(b) - Number(a));
}

export const getExpenseRows = createServerFn({ method: "GET" })
	.inputValidator((input: ExpenseQuery | undefined) => ({
		year: normalizeYear(input?.year),
	}))
	.handler(async ({ data }) => fetchExpenseRows(data.year));

export const getAvailableYears = createServerFn({ method: "GET" }).handler(
	async () => fetchAvailableYears(),
);
