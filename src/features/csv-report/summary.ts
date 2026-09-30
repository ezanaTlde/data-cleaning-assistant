import type { ColumnMetric, DuplicateRowFinding, QualityReport } from './types';

export const formatSummary = (report: QualityReport): string => report.summary;

export const buildMissingSummary = (missingValues: ColumnMetric[]): string => {
  if (missingValues.length === 0 || missingValues.every((metric) => metric.missingCount === 0)) {
    return 'No missing values were found.';
  }

  const totalMissing = missingValues.reduce((sum, item) => sum + item.missingCount, 0);
  return `${totalMissing} missing values were found across the dataset.`;
};

export const buildDuplicateSummary = (duplicateRows: DuplicateRowFinding[]): string => {
  if (duplicateRows.length === 0) {
    return 'No duplicate rows were found.';
  }

  return `${duplicateRows.length} duplicate row groups were found.`;
};
