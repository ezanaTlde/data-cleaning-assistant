import type { QualityReport } from './types';

type CsvQualityReportProps = {
  report: QualityReport | null;
  error: string | null;
};

export function CsvQualityReport({ report, error }: CsvQualityReportProps) {
  if (!report) {
    return (
      <div className="panel empty-state">
        <h2>Quality Report</h2>
        <p>Upload a CSV file to generate a data-quality report.</p>
      </div>
    );
  }

  return (
    <div className="panel">
      <h2>Quality Report</h2>

      {error && (
        <div className="alert error">
          <strong>File rejected:</strong> {error}
        </div>
      )}

      {report.status === 'ok' ? (
        <>
          <div className="summary-box">
            <h3>Summary</h3>
            <p>{report.summary}</p>
          </div>

          <div className="metrics-grid">
            <div className="metric">
              <span className="label">Rows inspected</span>
              <strong>{report.rowCount}</strong>
            </div>
            <div className="metric">
              <span className="label">Columns inspected</span>
              <strong>{report.columnCount}</strong>
            </div>
            <div className="metric">
              <span className="label">Missing values</span>
              <strong>{report.missingValues.reduce((sum, item) => sum + item.missingCount, 0)}</strong>
            </div>
            <div className="metric">
              <span className="label">Duplicate rows</span>
              <strong>{report.duplicateRows.length}</strong>
            </div>
          </div>

          <div className="section">
            <h3>Missing values</h3>
            {report.missingValues.length === 0 ? (
              <p>There are no columns to evaluate.</p>
            ) : (
              <ul className="list">
                {report.missingValues.map((item) => (
                  <li key={item.columnName}>
                    <strong>{item.columnName}</strong>: {item.missingCount} missing out of {item.totalRows} rows ({item.missingPercent}%).
                    <span> {item.explanation}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="section">
            <h3>Duplicate rows</h3>
            {report.duplicateRows.length === 0 ? (
              <p>No duplicate rows were found.</p>
            ) : (
              <ul className="list">
                {report.duplicateRows.map((duplicate, index) => (
                  <li key={`${duplicate.rowNumbers.join('-')}-${index}`}>
                    <strong>Rows {duplicate.rowNumbers.join(', ')}</strong>: {duplicate.explanation}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      ) : (
        <div className="section">
          <h3>Why this file was rejected</h3>
          <ul className="list">
            {report.errors.map((errorItem) => (
              <li key={errorItem.code}>{errorItem.message}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
