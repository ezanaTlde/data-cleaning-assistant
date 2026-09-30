export type UploadStatus = 'idle' | 'accepted' | 'rejected';

export type ValidationCode = 'EMPTY_FILE' | 'INVALID_CSV' | 'UNREADABLE_FILE';

export type ValidationError = {
  code: ValidationCode;
  message: string;
};

export type ColumnMetric = {
  columnName: string;
  missingCount: number;
  totalRows: number;
  missingPercent: number;
  explanation: string;
};

export type DuplicateRowFinding = {
  rowNumbers: number[];
  values: string[];
  explanation: string;
};

export type QualityReport = {
  fileName: string;
  status: 'ok' | 'rejected';
  rowCount: number;
  columnCount: number;
  missingValues: ColumnMetric[];
  duplicateRows: DuplicateRowFinding[];
  summary: string;
  errors: ValidationError[];
};
