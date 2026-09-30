# Tasks: CSV Quality Report

**Input**: Design documents from `/specs/001-csv-quality-report/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure for the local CSV quality report workflow.

- [X] T001 Create the app structure per the implementation plan in src/app/, src/features/csv-report/, src/lib/, tests/fixtures/, tests/unit/, and tests/integration/
- [X] T002 Initialize the Vite + React + TypeScript app and local browser workflow in package.json, vite.config.ts, and tsconfig.json
- [X] T003 [P] Configure linting and formatting in package.json, .eslintrc, and .prettierrc to match the local web app workflow
- [X] T004 [P] Create the initial UI shell in src/App.tsx and src/features/csv-report/CsvUploadForm.tsx so the upload flow has a visible starting point

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared data and validation infrastructure that must be complete before user stories can run independently.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T005 Create the CSV parsing and validation utilities in src/lib/csv.ts and src/lib/validation.ts for reading a working copy without mutating the original upload
- [X] T006 Implement the working-copy file model and validation state in src/features/csv-report/types.ts so valid, empty, invalid, and unreadable files are represented explicitly
- [X] T007 [P] Add shared formatting helpers in src/lib/formatting.ts for percentages, counts, and compliant user-facing explanations
- [X] T008 Build the upload analysis workflow in src/features/csv-report/useCsvAnalysis.ts so every report is derived from a copy of the CSV and the original file remains unchanged

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel.

---

## Phase 3: User Story 1 - CSV Upload and Valid Report Shell (Priority: P1) 🎯 MVP

**Goal**: Accept a CSV file, confirm upload state, and present a valid report shell without changing the original file.

**Independent Test**: Upload a valid CSV and confirm the app accepts the file, creates a working-copy analysis, and renders a report container with separate summary and detail areas.

### Implementation for User Story 1

- [X] T009 [P] [US1] Build the upload form in src/features/csv-report/CsvUploadForm.tsx to accept a CSV file and show a clear accepted-state message
- [X] T010 [US1] Implement upload state handling in src/features/csv-report/useCsvAnalysis.ts so a valid file yields working-copy rows and file metadata while preserving the source upload
- [X] T011 [US1] Create the report shell in src/features/csv-report/CsvQualityReport.tsx to separate overall summary content from detailed findings
- [X] T012 [US1] Wire the upload flow into src/App.tsx so the app loads the CSV, invokes analysis, and renders the report state clearly

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 - Missing-Value Detection and Explanation (Priority: P2)

**Goal**: Detect missing values per column, calculate percentages based on each column total, and explain the result plainly.

**Independent Test**: Upload a file with blank cells and confirm each column shows a missing count, percentage, column name, and plain-language explanation.

### Implementation for User Story 2

- [X] T013 [P] [US2] Implement per-column missing-value detection in src/lib/csv.ts so empty strings, null values, and whitespace-only cells count as missing, and percentages are based on the total number of rows in each column
- [X] T014 [US2] Add missing-value data objects in src/features/csv-report/types.ts and src/features/csv-report/summary.ts for ColumnMetric entries with column name, count, percent, and explanation
- [X] T015 [US2] Update the report renderer in src/features/csv-report/CsvQualityReport.tsx to display each missing-value finding with the affected column, count, percentage, and plain-language rationale
- [X] T016 [US2] Add the no-missing-values summary wording in src/features/csv-report/summary.ts such that a clean file says no missing values were found in plain language

**Checkpoint**: At this point, the missing-value checks work independently and are clearly explained to the user.

---

## Phase 5: User Story 3 - Duplicate-Row Detection and Explanation (Priority: P2)

**Goal**: Identify repeated rows, map them to source row numbers, and explain duplicate findings separately from missing values.

**Independent Test**: Upload a file with repeated rows and confirm the app reports the duplicate row locations and explains why the rows were flagged.

### Implementation for User Story 3

- [X] T017 [P] [US3] Implement duplicate-row detection in src/lib/csv.ts by comparing full-row values and tracking the row numbers for repeated records
- [X] T018 [US3] Create DuplicateRowFinding entries in src/features/csv-report/types.ts with rowNumbers, value snapshot, and explanation fields
- [X] T019 [US3] Add duplicate summary rendering in src/features/csv-report/CsvQualityReport.tsx and src/features/csv-report/summary.ts so duplicate findings are separate from missing-value findings
- [X] T020 [US3] Add the no-duplicate summary path in src/features/csv-report/summary.ts so a clean file says no duplicate rows were found in plain language

**Checkpoint**: At this point, the duplicate-row checks work independently and remain clearly separated from missing-value findings.

---

## Phase 6: User Story 4 - Empty, Invalid, and Combined Reporting (Priority: P1)

**Goal**: Reject unusable files gracefully, avoid misleading reports, and generate a final plain-language summary that combines both issue types when applicable.

**Independent Test**: Upload empty, malformed, and unreadable CSV inputs and confirm they show explanatory errors instead of a misleading quality report; upload a valid mixed dataset and confirm summary, missing-value findings, and duplicate findings are all rendered clearly.

### Implementation for User Story 4

- [X] T021 [P] [US4] Implement reject-state validation in src/lib/validation.ts for empty files, malformed CSV content, and unreadable files with specific explanations and no report generation
- [X] T022 [US4] Assemble the final QualityReport in src/features/csv-report/useCsvAnalysis.ts and src/features/csv-report/summary.ts including summary text, detailed findings, and a statement that the original upload was not modified
- [X] T023 [US4] Update the user-facing error handling in src/features/csv-report/CsvQualityReport.tsx so rejected inputs explain the issue and do not crash the app
- [X] T024 [US4] Validate the complete report flow against quickstart.md for valid, empty, malformed, and no-issue scenarios and confirm the sections remain clearly separated

**Checkpoint**: All required validation scenarios are now independently functional and explain the file status in plain language.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements that affect the complete CSV quality workflow.

- [X] T025 [P] Improve accessibility and copy quality in src/features/csv-report/CsvQualityReport.tsx and src/features/csv-report/CsvUploadForm.tsx so the report remains understandable for non-technical users
- [X] T026 [P] Review edge cases in src/lib/csv.ts for whitespace-only values, single-column files, single-row files, quoted commas, and large-file performance while preserving the local-only constraint
- [X] T027 Run the final quickstart validation and lint/test checks to confirm the CSV quality report flow works without modifying the uploaded source file

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion and blocks all user stories.
- **User Stories (Phases 3-6)**: All depend on the Foundational phase and can proceed in parallel once it is complete.
- **Polish (Phase 7)**: Depends on all user stories being complete.

### User Story Dependencies

- **User Story 1 (CSV Upload)**: No dependency on other stories; this is the MVP entry point.
- **User Story 2 (Missing Values)**: Depends only on the foundational validation layer and upload pipeline; can be implemented independently once the file parsing model is in place.
- **User Story 3 (Duplicate Rows)**: Depends on the same working-copy parsing layer; can proceed independently of US2 and US1 in parallel.
- **User Story 4 (Empty/Invalid Handling + Final Summary)**: Depends on the upload, parsing, and report model; should be completed before final polish to ensure consistent rejection and summary behavior.

### Parallel Opportunities

- Phase 1 tasks T003 and T004 can run in parallel.
- Phase 2 tasks T007 and T008 can run in parallel once T005 and T006 are complete.
- Story work can proceed in parallel after the foundational phase: US1, US2, US3, and US4 each have distinct feature files and can be developed independently.
- Within each story, independent tasks marked [P] can run in parallel.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Validate the upload and report shell independently
5. Stop and confirm the app accepts valid CSV input without mutating the original file

### Incremental Delivery

1. Setup + Foundational → the local CSV analysis pipeline is ready
2. Add User Story 1 → deliver upload acceptance and base report shell
3. Add User Story 2 → deliver missing-value analysis and explanations
4. Add User Story 3 → deliver duplicate-row analysis and explanations
5. Add User Story 4 → deliver empty, invalid, and combined reporting behavior
6. Finish with polish and validation across all stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together.
2. Once foundational work is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
   - Developer D: User Story 4
3. Final polish and validation happen after all stories pass independently.

---

## Notes

- [P] tasks are different-file tasks with no dependencies on incomplete work.
- Every task includes a concrete file path so implementation can proceed without extra context.
- Story labels map to the feature files and evidence in spec.md to keep the work traceable.
- The task set is intentionally scoped to the constitution and feature spec: local-only, non-destructive processing, missing-value detection, duplicate-row detection, and plain-language reporting.
