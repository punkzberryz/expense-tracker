import { createFileRoute } from "@tanstack/react-router";
import {
  getAvailableYears,
  getExpenseRows,
  getGoogleSheetUrl,
} from "@/data/google-sheets";
import { DashboardPage } from "./dashboard/dashboard-page";

export const Route = createFileRoute("/(dashboard)/")({
  loader: async () => {
    const availableYears = await getAvailableYears();
    const focusYear = availableYears[0] ?? null;
    const googleSheetUrl = await getGoogleSheetUrl();
    const rows = focusYear
      ? await getExpenseRows({ data: { year: focusYear } })
      : [];

    return {
      availableYears,
      focusYear,
      googleSheetUrl,
      rows,
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { availableYears, focusYear, googleSheetUrl, rows } =
    Route.useLoaderData();

  return (
    <DashboardPage
      availableYears={availableYears}
      focusYear={focusYear}
      googleSheetUrl={googleSheetUrl}
      rows={rows}
    />
  );
}
