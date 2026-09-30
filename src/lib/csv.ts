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

export type ParsedCsv = {
  headers: string[];
  rows: string[][];
};

const normalizeCell = (value: string | null | undefined): string => (value ?? '').trim();

export const isMissingValue = (value: string | null | undefined): boolean =>
  normalizeCell(value) === '';

export const emptyFileError = (): ValidationError => ({
  code: 'EMPTY_FILE',
  message: 'This file is empty. Please upload a CSV file with at least one row of data.',
});

export const unreadableFileError = (): ValidationError => ({
  code: 'UNREADABLE_FILE',
  message: 'The selected file could not be read. Please try a different CSV file or try again.',
});

export const invalidCsvError = (detail?: string): ValidationError => ({
  code: 'INVALID_CSV',
  message: detail
    ? `The selected file could not be parsed as CSV: ${detail}. Please check the file format and try again.`
    : 'The selected file could not be parsed as CSV. Please check the file format and try again.',
});

const parseCsvLine = (line: string): string[] => {
  const cells: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];

    if (character === '"') {
      if (inQuotes && line[index + 1] === '"') {
        current += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (character === ',' && !inQuotes) {
      cells.push(current);
      current = '';
      continue;
    }

    current += character;
  }

  if (inQuotes) {
    throw new Error('Unclosed quoted field in CSV input.');
  }

  cells.push(current);
  return cells;
};

export function parseCsvText(csvText: string): ParsedCsv {
  if (!csvText || !csvText.trim()) {
    throw new Error(emptyFileError().message);
  }

  const normalizedText = csvText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const rawLines = normalizedText.split('\n');
  const nonEmptyLines = rawLines.filter((line) => line.trim() !== '');

  if (nonEmptyLines.length === 0) {
    throw new Error(emptyFileError().message);
  }

  const rows = nonEmptyLines.map((line) => { 
    const parsedLine = parseCsvLine(line);
    return parsedLine.map((cell) => cell.trim());
  });

  const headerRow = rows[0].map((value, index) => value || `Column ${index + 1}`);
  const dataRows = rows.slice(1).map((row) => {
    const normalizedRow = [...row];
    while (normalizedRow.length < headerRow.length) {
      normalizedRow.push('');
    }
    if (normalizedRow.length > headerRow.length) {
      return normalizedRow.slice(0, headerRow.length);
    }
    return normalizedRow;
  });

  return { headers: headerRow, rows: dataRows };
}

export function getDuplicateRows(rows: string[][]): DuplicateRowFinding[] {
  const counts = new Map<string, number[]>();

  rows.forEach((row, index) => {
    const signature = row.join('\u0000');
    const existing = counts.get(signature) ?? [];
    existing.push(index + 1);
    counts.set(signature, existing);
  });

  return Array.from(counts.entries())
    .filter(([, rowNumbers]) => rowNumbers.length > 1)
    .map(([signature, rowNumbers]) => {
      const values = signature.split('\u0000');
      return {
        rowNumbers,
        values,
        explanation: `This row appears ${rowNumbers.length} times in the uploaded CSV.`,
      };
    });
}

export function analyzeCsvText(csvText: string, fileName = 'uploaded.csv'): QualityReport {
  if (!csvText || !csvText.trim()) {
    return {
      fileName,
      status: 'rejected',
      rowCount: 0,
      columnCount: 0,
      missingValues: [],
      duplicateRows: [],
      summary: 'The file is empty and could not be analyzed.',
      errors: [emptyFileError()],
    };
  }

  try {
    const parsed = parseCsvText(csvText);
    const rows = parsed.rows;
    const headers = parsed.headers;
    const totalRows = rows.length;
    const totalColumns = headers.length;

    if (totalRows === 0) {
      return {
        fileName,
        status: 'rejected',
        rowCount: 0,
        columnCount: 0,
        missingValues: [],
        duplicateRows: [],
        summary: 'The file is empty and could not be analyzed.',
        errors: [emptyFileError()],
      };
    }

    const missingValues: ColumnMetric[] = headers.map((columnName, columnIndex) => {
      const missingCount = rows.filter((row) => isMissingValue(row[columnIndex])).length;
      const missingPercent = totalRows === 0 ? 0 : Number(((missingCount / totalRows) * 100).toFixed(1));

      return {
        columnName,
        missingCount,
        totalRows,
        missingPercent,
        explanation:
          missingCount === 0
            ? `${columnName} has no missing values in this dataset.`
            : `${columnName} has ${missingCount} missing values out of ${totalRows} rows (${missingPercent}% missing).`,
      };
    });

    const duplicateRows = getDuplicateRows(rows);
    const totalMissingValues = missingValues.reduce((sum, column) => sum + column.missingCount, 0);
    const duplicateSummary = duplicateRows.length === 0 ? 'No duplicate rows were found.' : `${duplicateRows.length} duplicate row groups were found.`;
    const missingSummary =
      totalMissingValues === 0 ? 'No missing values were found.' : `${totalMissingValues} missing values were found across the dataset.`;

    return {
      fileName,
      status: 'ok',
      rowCount: totalRows,
      columnCount: totalColumns,
      missingValues,
      duplicateRows: duplicateRows.map((duplicate) => ({
        ...duplicate,
        explanation: `This row appears more than once in the uploaded CSV at rows ${duplicate.rowNumbers.join(', ')}.`,
      })),
      summary: `${missingSummary} ${duplicateSummary} The original file was not modified.`,
      errors: [],
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : invalidCsvError().message;

    return {
      fileName,
      status: 'rejected',
      rowCount: 0,
      columnCount: 0,
      missingValues: [],
      duplicateRows: [],
      summary: `The file could not be analyzed: ${message}`,
      errors: [message.includes('empty') ? emptyFileError() : invalidCsvError(message)],
    };
  }
}
