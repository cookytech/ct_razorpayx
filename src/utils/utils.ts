export const isNonNullObject = (input: any) => {
  return !!input && typeof input === 'object' && !Array.isArray(input);
};