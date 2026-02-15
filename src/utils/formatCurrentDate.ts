export const formatCurrentDate = (
  locale: string = 'en',
  date: Date = new Date()
): string =>
  date.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
