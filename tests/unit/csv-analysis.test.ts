import { describe, expect, it } from 'vitest';
import { analyzeCsvText, emptyFileError, getDuplicateRows, parseCsvText } from '../../src/lib/csv';

describe('CSV quality analysis', () => {
  it('parses a valid CSV into rows and headers', () => {
    const parsed = parseCsvText('name,city\nAlice,Paris\nBob,London');

    expect(parsed.headers).toEqual(['name', 'city']);
    expect(parsed.rows).toHaveLength(2);
    expect(parsed.rows[0]).toEqual(['Alice', 'Paris']);
  });

  it('flags missing values per column and reports percentages', () => {
    const result = analyzeCsvText('name,city\nAlice,\n,London\nCharlie,Paris\n');

    expect(result.missingValues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ columnName: 'name', missingCount: 1, missingPercent: 33.3 }),
        expect.objectContaining({ columnName: 'city', missingCount: 1, missingPercent: 33.3 }),
      ]),
    );
  });

  it('flags repeated rows and reports the row numbers', () => {
    const duplicates = getDuplicateRows([
      ['a', 'b'],
      ['x', 'y'],
      ['a', 'b'],
      ['c', 'd'],
      ['a', 'b'],
    ]);

    expect(duplicates).toHaveLength(1);
    expect(duplicates[0].rowNumbers).toEqual([1, 3, 5]);
  });

  it('rejects empty files with a clear message', () => {
    const result = analyzeCsvText('');

    expect(result.status).toBe('rejected');
    expect(result.errors[0].code).toBe('EMPTY_FILE');
    expect(result.errors[0].message).toContain('empty');
  });

  it('returns the canonical empty file error payload', () => {
    expect(emptyFileError().code).toBe('EMPTY_FILE');
  });
});
