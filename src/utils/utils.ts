export const isNonNullObject = (input: any) => {
  return !!input && typeof input === 'object' && !Array.isArray(input);
};

export function getDateInSecs(date: string | number | Date) {
  return +new Date(date) / 1000;
}

export function normalizeDate(date: number | string | Date) {
  return typeof date === 'number' ? date : getDateInSecs(date);
}
