# Quickstart: CSV Quality Report Validation

## Prerequisites

- Node.js 20 or newer
- npm 10 or newer
- A local CSV file for testing

## Setup

1. Open the project root.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the app in development mode:
   ```bash
   npm run dev
   ```

## Validation scenarios

### 1. Valid file with mixed quality

- Upload a CSV that contains at least one blank value and at least one repeated row.
- Expected outcome:
  - The file is accepted.
  - Missing-value metrics are shown per column.
  - Duplicate rows are reported with row references.
  - A plain-language summary is displayed.

### 2. Empty file

- Upload a zero-byte file.
- Expected outcome:
  - The app rejects the file with a clear explanation.
  - No misleading report is shown.
  - The UI states that the file cannot be analyzed.

### 3. Malformed CSV

- Upload a file with broken quoting or inconsistent columns.
- Expected outcome:
  - The app surfaces a validation error instead of crashing.
  - A user-friendly message explains the issue.

### 4. No issues found

- Upload a clean CSV with complete values and no duplicates.
- Expected outcome:
  - The report states that no missing values were found.
  - The duplicate summary states that no duplicate rows were found.

## Expected artifacts

The report should include:
- dataset name or file identifier
- row and column counts
- missing-value findings by column
- duplicate-row findings by row number
- plain-language summary
- explicit statement that the original file was not modified

## Notes

This validation guide is intentionally focused on proving the feature behavior without embedding full implementation logic; the detailed workflow is captured in the implementation tasks that follow this plan.
