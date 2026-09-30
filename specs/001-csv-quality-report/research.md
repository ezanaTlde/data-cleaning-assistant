# Research: CSV Quality Report

## Decision: Local browser-only validation with in-memory analysis

The feature will be implemented as a local web application that reads uploaded CSV data in the browser, creates an isolated working copy, and computes both missing-value and duplicate-row checks without sending data anywhere else.

### Rationale
- The constitution explicitly requires local-only processing and no mutation of the source file.
- The use case is a single user validating a local dataset, so a browser-side workflow is simpler and more transparent than a remote pipeline.
- A working-copy approach makes it easier to reject invalid input and still render a clear explanation without corrupting the original upload.

### Alternatives considered
- Remote processing service: rejected because it violates the local-only rule and would expose user data outside the trusted environment.
- Server-side file mutation: rejected because it risks changing the original file and adds unnecessary complexity for a v1 feature.
- Relying only on raw CSV parsing without validation metadata: rejected because the report needs explicit column/row associations and plain-language summaries.

## Decision: Missing-value detection uses column totals and whitespace-aware blanks

For each column, the app will count empty strings, null values, and whitespace-only cells as missing values, while keeping a clear record of the total number of rows inspected.

### Rationale
- The spec requires percentages based on the total rows in the relevant column and plain-language explanations.
- Many CSV uploads include blank strings or whitespace-only values, which should be treated as missing in a user-friendly way.
- Consistent column-level metrics ensure fairness and repeatability across datasets.

### Alternatives considered
- Treating only empty strings as missing: rejected because whitespace-only cells are common and would under-report quality issues.
- Per-row aggregated percentages only: rejected because the feature requires per-column detail and column-to-row traceability.

## Decision: Duplicate detection uses full-row equality with row-number references

The app will compare each CSV record against prior rows using row values as a whole, then report repeated rows by source row number or record position.

### Rationale
- The spec requires duplicate rows to be identified and reported in a way that maps back to the source file.
- Exact row comparison is deterministic, simple to explain, and consistent with the minimal validation scope.
- Row numbers give users a concrete way to inspect the duplicate entries in the original CSV.

### Alternatives considered
- Comparing by primary keys only: rejected because the feature explicitly states detection of duplicate rows across the full uploaded file.
- Deduplicating rows silently: rejected because the user needs to see the repeated rows and understand why they were flagged.

## Decision: Validation failure states are explicit and user-friendly

The app will distinguish between empty file, malformed CSV, unreadable file, and valid state, and it will display a clear message instead of producing a misleading report.

### Rationale
- The specification calls for graceful handling of invalid and empty input without crashing.
- A rejected file should explain both the specific issue and the next step for the user.
- A valid report should never be generated when the input cannot be analyzed.

### Alternatives considered
- Generic "error occurred" messages: rejected because they do not help the user understand what to fix.
- Allowing partial analysis of malformed files: rejected because it creates misleading quality reports and violates the trust requirement.

## Decision: Report structure separates findings from summary

The final UI will include a summary section, detailed missing-value findings, and duplicate-row findings as distinct blocks, with an explanation for why each rule triggered.

### Rationale
- The constitution requires transparency and user-centered reporting.
- Separation between overview and evidence makes the report easier to scan and prevents confusion between issue types.

### Alternatives considered
- Single raw technical dump: rejected because it is not plain language and does not meet the product requirement.
- Mixing summary and details without distinction: rejected because it reduces clarity and trust.
