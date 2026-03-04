import { describe, it, expect } from 'vitest';
import { calculateWorkday, holidaysList } from './date-utils';

/**
 * Converts ISO date string to toLocaleDateString format
 * Example: '2026-02-27' -> same format as calculateWorkday returns
 */
function normalizeLocaleDateString(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString();
}

describe('calculateWorkday', () => {
  it('should return the previous workday when the current day is Monday', () => {
    // Monday 2026-03-02 -> should return Friday 2026-02-27
    const result = calculateWorkday('2026-03-02', holidaysList);
    expect(result).toBe(normalizeLocaleDateString('2026. 2. 27.'));
  });

  it('should skip weekends and return Friday when the current day is Monday', () => {
    // Monday 2026-03-09 -> should return Friday 2026-03-06
    const result = calculateWorkday('2026-03-09', holidaysList);
    expect(result).toBe(normalizeLocaleDateString('2026. 3. 6.'));
  });

  it('should skip a holiday and return the previous workday', () => {
    // 2026-03-03 is after a holiday (2026. 3. 2.), previous day is 2026-03-02 (Monday)
    // Should return 2026-02-27 (Friday)
    const result = calculateWorkday('2026-03-03', holidaysList);
    expect(result).toBe(normalizeLocaleDateString('2026. 2. 27.'));
  });

  it('should return the previous workday for a regular weekday', () => {
    // Wednesday 2026-03-04 -> should return Tuesday 2026-03-03
    // 2026-03-02 is a holiday, but it does not affect this case
    const result = calculateWorkday('2026-03-04', holidaysList);
    expect(result).toBe(normalizeLocaleDateString('2026. 3. 3.'));
  });

  it('should skip multiple consecutive holidays', () => {
    // After holidays around 2025-10-09 (right after Oct 6-9 holidays)
    // Should return 2025-10-02 or earlier
    const result = calculateWorkday('2025-10-10', holidaysList);
    expect(result).toBe(normalizeLocaleDateString('2025. 10. 2.'));
  });

  it('should handle a day after weekend correctly', () => {
    // Monday 2026-03-16 -> should return Friday 2026-03-13
    const result = calculateWorkday('2026-03-16', holidaysList);
    expect(result).toBe(normalizeLocaleDateString('2026. 3. 13.'));
  });

  it('should work with an empty holidays list', () => {
    // Monday without holidays -> Friday
    const result = calculateWorkday('2026-03-09', []);
    expect(result).toBe(normalizeLocaleDateString('2026. 3. 6.'));
  });

  it('should handle Friday and return Thursday', () => {
    // Friday 2026-03-06 -> should return Thursday 2026-03-05
    const result = calculateWorkday('2026-03-06', holidaysList);
    expect(result).toBe(normalizeLocaleDateString('2026. 3. 5.'));
  });

  it('should handle Sunday and skip Saturday', () => {
    // Sunday 2026-03-08 -> should return Friday 2026-03-06
    const result = calculateWorkday('2026-03-08', holidaysList);
    expect(result).toBe(normalizeLocaleDateString('2026. 3. 6.'));
  });

  it('should handle Saturday and return Friday', () => {
    // Saturday 2026-03-07 -> should return Friday 2026-03-06
    const result = calculateWorkday('2026-03-07', holidaysList);
    expect(result).toBe(normalizeLocaleDateString('2026. 3. 6.'));
  });
});
