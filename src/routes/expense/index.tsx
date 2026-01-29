import { createFileRoute, Link } from "@tanstack/react-router";
import { getAvailableYears } from "@/data/google-sheets";

export const Route = createFileRoute("/expense/")({
  loader: async () => getAvailableYears(),
  component: RouteComponent,
});

function RouteComponent() {
  const years = Route.useLoaderData();
  const currentYear = new Date().getFullYear().toString();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Expenses</h1>
      <p className="mt-2 text-slate-600">
        Select a year to view the Google Sheets data.
      </p>
      <div className="mt-4">
        {years.length === 0 ? (
          <p className="text-sm text-slate-500">
            No year-named sheets found in the spreadsheet.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {years.map((year) => (
              <Link
                key={year}
                to="/expense/$year"
                params={{ year }}
                className={
                  year === currentYear
                    ? "inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                    : "inline-flex items-center rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                }
              >
                View {year}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
