import {formatCurrentDate} from './formatCurrentDate';

describe('formatCurrentDate', () => {
  const fixedDate = new Date(2025, 0, 15);

  it('formats date in English by default', () => {
    const result = formatCurrentDate('en', fixedDate);
    expect(result).toBe('January 15, 2025');
  });

  it('formats date in Czech locale', () => {
    const result = formatCurrentDate('cs', fixedDate);
    expect(result).toBe('15. ledna 2025');
  });

  it('formats date in German locale', () => {
    const result = formatCurrentDate('de', fixedDate);
    expect(result).toBe('15. Januar 2025');
  });

  it('uses current date when no date is provided', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2025, 5, 10));

    const result = formatCurrentDate('en');
    expect(result).toBe('June 10, 2025');

    jest.useRealTimers();
  });

  it('defaults to English locale when no arguments provided', () => {
    jest.useFakeTimers();
    jest.setSystemTime(fixedDate);

    const result = formatCurrentDate();
    expect(result).toBe('January 15, 2025');

    jest.useRealTimers();
  });
});
