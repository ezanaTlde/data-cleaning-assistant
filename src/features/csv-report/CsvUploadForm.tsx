import type { ChangeEvent } from 'react';

type CsvUploadFormProps = {
  onFileChange: (file: File | null) => void;
  status: 'idle' | 'accepted' | 'rejected';
};

export function CsvUploadForm({ onFileChange, status }: CsvUploadFormProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0] ?? null;
    onFileChange(selected);
  };

  return (
    <div className="panel">
      <h2>Upload CSV</h2>
      <label className="upload-label">
        <input type="file" accept=".csv,text/csv" onChange={handleChange} />
      </label>
      <p className="status-text">
        {status === 'idle' && 'No file uploaded yet.'}
        {status === 'accepted' && 'File uploaded and ready for quality checks.'}
        {status === 'rejected' && 'The uploaded file could not be processed.'}
      </p>
    </div>
  );
}
