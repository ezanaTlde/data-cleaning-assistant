# CSV Quality Report Contract

This project is a local browser application, so the primary interfaces are internal application contracts rather than remote API endpoints.

## Upload contract

### Input

```json
{
  "fileName": "sample.csv",
  "fileSize": 12345,
  "content": "column_a,column_b\n1,alpha\n,alpha\n3,beta"
}
```

### Validation result

```json
{
  "status": "rejected",
  "error": {
    "code": "INVALID_CSV",
    "message": "The selected file could not be parsed as CSV. Please check the file format and try again."
  }
}
```

## Report contract

### Success response

```json
{
  "fileName": "sample.csv",
  "status": "ok",
  "rowCount": 5,
  "columnCount": 3,
  "missingValues": [
    {
      "columnName": "email",
      "missingCount": 2,
      "totalRows": 5,
      "missingPercent": 40,
      "explanation": "This column has 2 missing values out of 5 rows."
    }
  ],
  "duplicateRows": [
    {
      "rowNumbers": [2, 5],
      "values": ["alice@example.com", "Alice", "2024-01-01"],
      "explanation": "This row appears more than once in the uploaded CSV."
    }
  ],
  "summary": "The file has 2 missing cells and 1 duplicate row. The original file was not modified.",
  "errors": []
}
```

## Notes

- The source file is never mutated; all reporting is derived from a working-copy representation.
- Validation failures return a user-facing explanation and suppress a misleading positive-quality report.
- The report must clearly separate missing-value findings, duplicate findings, and summary content.
