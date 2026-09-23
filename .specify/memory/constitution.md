<!--
Sync Impact Report
Version change: n/a -> 1.0.0
Modified principles: n/a -> I. Transparency in Findings, II. Non-Destructive Data Handling,
III. Minimal, Explicit Validation First, IV. Local-Only Data Processing, V. User-Centered Reporting
Added sections: Data Handling & Privacy, Reporting Standards
Removed sections: none
Deferred items: none
-->

# Data Quality Report Constitution

## Core Principles

### I. Transparency in Findings
This application MUST show every data-quality issue it detects in plain language, including what was found, which column or row it affected, and why it matters. Every reported issue MUST map to an explicit validation rule, and the UI MUST distinguish between a detected problem and any suggested remediation. If a value is flagged as missing or duplicated, the report MUST state the exact reason and the rule used. Rationale: Users must be able to inspect and understand the evidence behind each finding without guessing.

### II. Non-Destructive Data Handling
The application MUST never modify the original CSV uploaded by the user. It MUST read the file into an isolated in-memory or temporary working copy for analysis, and all validation, cleaning, and reporting MUST operate only on that copy. Any exported output MUST be generated from the working copy and clearly labeled as derived, not the source. Rationale: The original file is user-owned evidence and must remain unchanged.

### III. Minimal, Explicit Validation First
The system MUST start with the smallest reliable quality checks necessary for the product: missing values and duplicate rows or keys. It MUST NOT add broader validation rules until they are needed, approved, and clearly explained to the user. Each rule MUST be deterministic, testable, and limited to the current feature scope. Rationale: Simplicity reduces risk, improves explainability, and keeps the feedback honest.

### IV. Local-Only Data Processing
The application MUST NOT transmit uploaded CSV content or generated report data to external services, third-party APIs, or remote analytics systems. Data MUST remain within the user’s browser or the local application environment unless an explicit and documented local persistence feature is added. Any logging MUST exclude raw row contents and only record aggregate counts or rule metadata. Rationale: User-supplied datasets may contain personal or sensitive information and must not leave the trusted processing boundary.

### V. User-Centered Reporting
The app MUST present the quality report in a way that is easy to understand, even for non-technical users. It MUST summarize the number of issues found, explain the checks performed, and separate the detection result from any suggested corrective action. The report MUST never claim a fix without showing a clear explanation of what was changed and why. Rationale: Trust is built by showing the actual evidence.

## Data Handling & Privacy
This app is a CSV inspection tool, not a data-sharing platform. Uploaded files are treated as untrusted input. They MUST be validated only for the declared checks, and the system MUST avoid logging or persisting raw values beyond what is required for the active user session. If a feature later needs persistence, it MUST be opt-in, clearly disclosed, and limited to the minimum required metadata.

## Reporting Standards
Every report returned to the user MUST include:
- The dataset name or file identifier
- The checks performed
- The count of rows and columns inspected
- The number of missing-value and duplicate findings
- A plain-language explanation of each finding and why the rule flagged it
- A clear statement that the original upload was not modified

## Governance
This constitution governs data-quality reporting behavior for the application. Amendments require a documented rationale, an updated version number, and a review that confirms the change preserves transparency, data minimization, and local-only handling. Any change that broadens scope beyond missing values and duplicates MUST state the added checks and why they are necessary. Compliance is reviewed by confirming that the UI and logic still show the evidence behind each finding, never change the source CSV, and do not send data off device.

**Version**: 1.0.0 | **Ratified**: 2026-09-23 | **Last Amended**: 2026-09-23
