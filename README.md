# Data Cleaning Assistant

A small web app for checking a CSV file's data quality. Upload a CSV and it reports missing values (per column, with counts and percentages) and duplicate rows, without modifying your original file.

Built as part of SEIS 606 (Data Analytics and Visualization), using GitHub Spec Kit for spec-driven, AI-assisted development with GitHub Copilot.

## What it does

- Upload a CSV file through the browser
- Detects missing values in each column and reports counts/percentages
- Detects duplicate rows and reports which rows are involved
- Generates a plain-language summary report
- Handles empty, invalid, or malformed files gracefully
- Never modifies the original uploaded file; all processing is local (no data is sent to any external server)

## Project artifacts

- `.specify/memory/constitution.md` — project principles (constitution)
- `specs/001-csv-quality-report/spec.md` — feature specification (Objective/Behavior/Constraints/Verification format)
- `specs/001-csv-quality-report/plan.md` — technical plan
- `specs/001-csv-quality-report/tasks.md` — implementation task breakdown
- `mockup/` — initial UI mockup screenshots
- `src/` — application source code
- `tests/unit/` — automated test suite

## Requirements

- [Node.js](https://nodejs.org) (LTS version) and npm, which comes bundled with it

## How to run this app

1. Clone this repository:
   ```
   git clone https://github.com/ezanaTlde/data-cleaning-assistant.git
   cd data-cleaning-assistant
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```
4. Open the URL shown in the terminal (typically `http://localhost:5173`) in your browser.

## How to run the automated tests

```
npm test
```

## Notes

- On Windows, if `npm` commands are blocked by a PowerShell execution policy error, run this once in PowerShell: `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`
- The file upload input is currently limited to `.csv` files by default in the browser's file picker; non-CSV files can still be selected by changing the file type filter to "All Files" in that dialog.