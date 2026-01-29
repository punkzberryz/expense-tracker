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
  - Implement category breakdown view.
  - Validate chart data accuracy against the sheet.
- Insight rules
  - Add top categories and monthly total spend insights.
  - Define any anomaly/delta rules if needed later.
- [ ] Implement category breakdown view.
- [ ] Add insight cards for top categories and monthly total spend.

### Done

- Data foundation
  - Verified Google Sheet columns and parsing rules.
  - Confirmed category/type mapping and required fields.
- MVP insights
  - Implemented trend line view.
  - Implemented monthly summary view.

## Backlog (optional)

- [ ] (empty)

## Done

- [ ] (empty)
