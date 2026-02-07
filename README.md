# Expense Tracker (Google Sheets)

## Overview

This app reads expense rows from a Google Sheet and visualizes them for insights.
The source sheet is organized by year (tabs named like `2025`, `2026`). The app
is **read-only** with respect to expenses; editing the sheet directly is not
recommended.

See `src/data/google-sheets.ts` for the expected columns and parsing rules.

## Requirements

- Node.js + pnpm
- A Google Sheets document with year-based tabs
- A service account with access to the spreadsheet

## Environment

Create a `.env` file with:

```
GOOGLE_SHEET_ID=
GOOGLE_SHEETS_CLIENT_EMAIL=
GOOGLE_SHEETS_PRIVATE_KEY=
# Optional alternative:
# GOOGLE_SHEETS_PRIVATE_KEY_B64=
```

## Getting started

```
pnpm install
pnpm dev
```

The app runs at `http://localhost:3000`.

## Linting & tests

```
pnpm lint
pnpm test
```

## Routes

- `/expense` — entry page
- `/expense/:year` — expense table for a specific year tab
- `/insights/category-breakdown/:year` — category totals and shares
- `/insights/trend-line/:year` — monthly spend trend
- `/insights/monthly-summary/:year` — monthly totals and averages
- `/insights/monthly-summary/:year/:month` — category breakdown for a specific month

## Notes

- Expense sheet columns are: `Date`, `Name`, `Category`, `Type`, `Amount`, `Description`.
- `Type` is expected to be `EXPENSE` for rows created by the logging app.
- Category values follow the logging app schema.

## Docs

- `docs/RULES.md` — engineering rules
- `docs/PLANS.md` — roadmap and open questions
