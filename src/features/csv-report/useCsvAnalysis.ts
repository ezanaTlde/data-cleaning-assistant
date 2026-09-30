import { useCallback, useState } from 'react';
import { analyzeCsvText } from '../../lib/csv';
import type { QualityReport } from './types';

export function useCsvAnalysis() {
  const [report, setReport] = useState<QualityReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'accepted' | 'rejected'>('idle');

  const analyzeFile = useCallback(async (file: File | null) => {
    if (!file) {
      setError('Please select a CSV file to start the quality check.');
      setStatus('rejected');
      setReport(null);
      return;
    }

    if (!file.name.toLowerCase().endsWith('.csv')) {
      const rejected = {
        fileName: file.name,
        status: 'rejected' as const,
        rowCount: 0,
        columnCount: 0,
        missingValues: [],
        duplicateRows: [],
        summary: 'Only CSV files can be analyzed in this workflow.',
        errors: [{ code: 'INVALID_CSV' as const, message: 'Only CSV files can be analyzed in this workflow.' }],
      };
      setReport(rejected);
      setError(rejected.summary);
      setStatus('rejected');
      return;
    }

    try {
      const text = await file.text();
      const result = analyzeCsvText(text, file.name);
      setReport(result);
      setStatus(result.status === 'ok' ? 'accepted' : 'rejected');
      setError(result.status === 'ok' ? null : result.summary);
    } catch (uploadError) {
      const message = uploadError instanceof Error ? uploadError.message : 'The selected file could not be read.';
      const rejectedReport: QualityReport = {
        fileName: file.name,
        status: 'rejected',
        rowCount: 0,
        columnCount: 0,
        missingValues: [],
        duplicateRows: [],
        summary: message,
        errors: [{ code: 'UNREADABLE_FILE', message }],
      };
      setReport(rejectedReport);
      setError(message);
      setStatus('rejected');
    }
  }, []);

  return { report, status, error, analyzeFile };
}
