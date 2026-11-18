/** Auto-generate a random unlock PIN when a device is registered (1–8 digits). */
export function generateUnlockCode(): string {
  const length = Math.floor(Math.random() * 8) + 1;
  if (length === 1) return String(Math.floor(Math.random() * 9) + 1);
  const min = 10 ** (length - 1);
  const max = 10 ** length - 1;
  return String(Math.floor(Math.random() * (max - min + 1)) + min);
}
