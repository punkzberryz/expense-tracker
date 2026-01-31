# PLANS

## Product overview

- This app post-processes expense data recorded in a Google Sheet.
- Each sheet tab is named by year (for example, `2025`, `2026`).
- The app visualizes the data and provides insights.
- Editing the Google Sheet (especially expense data) is not recommended.
- See `src/data/google-sheets.ts` for the expected column structure.

## Open questions

- [x] What are the exact column names, types, and required/optional fields in the Google Sheet?
  - Columns: `Date`, `Name`, `Category`, `Type`, `Amount`, `Description`.
  - `Category` values map to the app’s expense categories.
  - `Type` is set to `EXPENSE` by the logging app.
- [x] What are the MVP charts (trend line, category breakdown, monthly summary, top merchants)?
  - MVP charts: trend line, category breakdown, monthly summary.
- [x] Which insight rules matter most (anomalies, biggest deltas, top categories)?
  - Insight rules: top categories and monthly total spend (to judge tightening spending).

## Roadmap

### Todo

- MVP insights
  - Validate chart data accuracy against the sheet.
- Insight rules
  - Define any anomaly/delta rules if needed later.
- Feature ideas
  - Add insight cards for biggest MoM change, new top category, and largest single purchase.
  - Flag anomalous days/categories (2–3× above recent average).
  - Add budget targets with over/under indicators.
  - Add merchant view (top merchants, repeat merchants, fastest-growing spend).
  - Add comparison modes (YTD vs last year, last 3 months vs prior 3 months).
  - Add tag/note filters (travel, subscriptions, one-off).

### Done

- Data foundation
  - Verified Google Sheet columns and parsing rules.
  - Confirmed category/type mapping and required fields.
- MVP insights
  - Implemented trend line view.
  - Implemented monthly summary view.
  - Implemented category breakdown view.
- Insight rules
  - Added top categories and monthly total spend insights.

## Backlog (optional)

- [ ] (empty)

## Done

- [ ] (empty)
