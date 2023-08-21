export const tryParse = (str?: string | null) => {
  if (!str) return;

  try {
    return JSON.parse(str);
  } catch {}
};
