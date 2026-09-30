# Data Model: CSV Quality Report

## Entities

### UploadedFile

Represents the source CSV selected by the user before analysis.

| Field | Type | Description | Validation |
| --- | --- | --- | --- |
| name | string | Original file name | Must be non-empty if available |
| size | number | File size in bytes | Must be >= 0 |
| status | enum | `valid`, `empty`, `invalid`, `unreadable` | Determined by validation step |
| rawRows | array<string[]> | Working-copy row data parsed from the CSV | Must be available when `status = valid` |
| headers | string[] | Column names from the first row if present | Must be present for a valid file |

### ColumnMetric

Represents the missing-value result for one data column.

| Field | Type | Description | Validation |
| --- | --- | --- | --- |
| columnName | string | Column label shown in the report | Required |
| missingCount | number | Number of empty or blank cells in the column | >= 0 |
| totalRows | number | Number of rows inspected in the column | > 0 for valid analysis |
| missingPercent | number | Percent missing in the column | 0-100 |
| explanation | string | Plain-language issue description | Required |

### DuplicateRowFinding

Represents one repeated row or repeated record in the uploaded CSV.

| Field | Type | Description | Validation |
| --- | --- | --- | --- |
| rowNumbers | number[] | All locations where the repeated row appears | Must contain at least 2 values |
| values | string[] | Row data for the duplicated record | Required |
| explanation | string | Why the row was flagged as duplicate | Required |

### QualityReport

Aggregates all findings into the final result returned to the user.

| Field | Type | Description | Validation |
| --- | --- | --- | --- |
| fileName | string | Name of the uploaded file | Required |
| status | enum | `ok` or `rejected` | Required |
| rowCount | number | Total rows analyzed | >= 0 |
| columnCount | number | Number of columns analyzed | >= 0 |
| missingValues | ColumnMetric[] | Reports for each column | May be empty |
| duplicateRows | DuplicateRowFinding[] | Duplicate findings | May be empty |
| summary | string | Plain-language summary | Required |
| errors | ValidationError[] | Rejection reasons if any | May be empty |

### ValidationError

Represents a user-visible reason why a file was rejected.

| Field | Type | Description | Validation |
| --- | --- | --- | --- |
| code | enum | `EMPTY_FILE`, `INVALID_CSV`, `UNREADABLE_FILE` | Required |
| message | string | Plain-language explanation | Required |

## Relationships

- One `UploadedFile` can produce one `QualityReport` when it is valid.
- One `QualityReport` contains many `ColumnMetric` entries.
- One `QualityReport` contains many `DuplicateRowFinding` entries.
- A `QualityReport` may include zero or more `ValidationError` entries when the file is rejected.

## State transitions

1. `UploadedFile` is created from the user upload.
2. File validation runs and sets `status` to `valid`, `empty`, `invalid`, or `unreadable`.
3. If `status = valid`, the app calculates column metrics and duplicate findings.
4. If `status != valid`, the app returns a rejection report with `status = rejected` and no misleading quality metrics.
5. The report is rendered with a summary, detailed findings, and a clear statement that the original file was not modified.

## Validation rules

- Missing-value percentages must be calculated using the total number of rows in the relevant column.
- Blank strings and whitespace-only cells are treated as missing values.
- Duplicate rows are identified by exact row equality across the parsed file.
- Empty or malformed files must never produce a normal positive-quality report.
- Original uploaded content must remain unchanged; all calculations happen on a working copy.
