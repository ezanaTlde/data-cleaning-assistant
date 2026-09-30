import { CsvQualityReport } from './features/csv-report/CsvQualityReport';
import { CsvUploadForm } from './features/csv-report/CsvUploadForm';
import { useCsvAnalysis } from './features/csv-report/useCsvAnalysis';

export default function App() {
  const { report, status, error, analyzeFile } = useCsvAnalysis();

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Data Cleaning Assistant</p>
          <h1>CSV quality report</h1>
        </div>
      </header>

      <CsvUploadForm onFileChange={analyzeFile} status={status} />
      <CsvQualityReport report={report} error={error} />
    </main>
  );
}
