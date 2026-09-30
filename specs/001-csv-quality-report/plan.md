# Implementation Plan: CSV Quality Report

**Branch**: `001-csv-quality-report` | **Date**: 2026-09-30 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-csv-quality-report/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

Build a local-first CSV inspection workflow that accepts a user-uploaded file, validates empty and malformed input, calculates missing-value counts and percentages per column, flags duplicate rows with source locations, and renders a plain-language summary that clearly separates findings from the original file state. The implementation will use a browser-side working copy so the uploaded source file is never modified and no data leaves the local environment.

## Technical Context

**Language/Version**: TypeScript 5.x + React 18 + Vite (resolved during research; strong fit for local CSV upload UX and graceful validation flows)

**Primary Dependencies**: React, Vite, Papa Parse (or equivalent CSV parser), Vitest, React Testing Library

**Storage**: In-memory working copy only; no persisted database or server-side storage in v1

**Testing**: Vitest for unit/integration tests, React Testing Library for UI validation, fixture-based CSV files for edge cases

**Target Platform**: Desktop web browser in a local or trusted environment

**Project Type**: Web application

**Performance Goals**: Process CSV files up to several MB in-browser without external requests; keep row scanning linear and response feedback immediate for typical single-user uploads

**Constraints**: Local-only processing, no external services, original file must remain untouched, plain-language explanations for every finding, graceful rejection for empty/invalid input

**Scale/Scope**: Single-user workflow; limited to missing-value and duplicate-row quality checks for a single CSV at a time

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Initial Gate

- Transparency in Findings: PASS — every issue must map to a specific column or row and include plain-language explanation.
- Non-Destructive Data Handling: PASS — the source file will be read into a working copy only and never modified.
- Minimal, Explicit Validation First: PASS — v1 is limited to missing values and duplicate rows, matching the feature scope.
- Local-Only Data Processing: PASS — no external service calls or remote processing are allowed.
- User-Centered Reporting: PASS — the final report will separate summary and detailed findings and clearly explain rejected inputs.

### Final Gate After Design

- The design still preserves the evidence trail for each missing/duplicate finding.
- All analysis remains on an isolated in-memory dataset derived from the uploaded file.
- The app does not broaden validation scope beyond the requested rules.
- Report output remains plain-language and separated by issue type.

## Project Structure

### Documentation (this feature)

```text
specs/001-csv-quality-report/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── App.tsx
│   └── routes/
├── features/
│   └── csv-report/
│       ├── CsvUploadForm.tsx
│       ├── CsvQualityReport.tsx
│       ├── useCsvAnalysis.ts
│       ├── types.ts
│       └── summary.ts
├── lib/
│   ├── csv.ts
│   ├── validation.ts
│   └── formatting.ts
└── styles/

tests/
├── fixtures/
│   ├── valid.csv
│   ├── empty.csv
│   ├── malformed.csv
│   └── duplicate-heavy.csv
├── integration/
│   └── csv-quality-report-flow.test.ts
├── unit/
│   ├── csv-analysis.test.ts
│   └── validation.test.ts
└── contract/
    └── csv-quality-report.contract.test.ts
```

**Structure Decision**: A single local web app with a focused feature module under `src/features/csv-report` and a small shared library for CSV parsing and high-level aggregation logic. This keeps the scope narrow while supporting the required upload, validation, and report presentation flow.

## Complexity Tracking

No constitution violations are expected for this feature; the design remains within the required scope of local-only, non-destructive CSV quality analysis.
