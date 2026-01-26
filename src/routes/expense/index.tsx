import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/expense/")({
  component: RouteComponent,
});

function RouteComponent() {
  const year = new Date().getFullYear();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Expenses</h1>
      <p className="mt-2 text-slate-600">
        Select a year to view the Google Sheets data.
      </p>
      <div className="mt-4">
        <Link
          to="/expense/$year"
          params={{ year: year.toString() }}
          className="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          View {year}
        </Link>
      </div>
    </div>
  );
}
