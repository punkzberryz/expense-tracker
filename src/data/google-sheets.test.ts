import { describe, expect, it } from "vitest";
import { buildGoogleSheetUrl } from "./google-sheets";

describe("buildGoogleSheetUrl", () => {
	it("builds a direct link to the spreadsheet", () => {
		expect(buildGoogleSheetUrl("sheet-123")).toBe(
			"https://docs.google.com/spreadsheets/d/sheet-123/edit",
		);
	});
});
