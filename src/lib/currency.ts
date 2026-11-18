export type CurrencyCode =
  | "USD"
  | "BDT"
  | "EUR"
  | "GBP"
  | "INR"
  | "AED"
  | "SAR";

export type CurrencyOption = {
  code: CurrencyCode;
  name: string;
  symbol: string;
  locale: string;
};

/** Display currencies available in Admin → Settings */
export const CURRENCY_OPTIONS: CurrencyOption[] = [
  { code: "USD", name: "US Dollar", symbol: "$", locale: "en-US" },
  { code: "BDT", name: "Bangladeshi Taka", symbol: "৳", locale: "en-BD" },
  { code: "EUR", name: "Euro", symbol: "€", locale: "en-IE" },
  { code: "GBP", name: "British Pound", symbol: "£", locale: "en-GB" },
  { code: "INR", name: "Indian Rupee", symbol: "₹", locale: "en-IN" },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ", locale: "en-AE" },
  { code: "SAR", name: "Saudi Riyal", symbol: "﷼", locale: "en-SA" },
];

export const DEFAULT_CURRENCY: CurrencyCode = "USD";

/** Mock ledger amounts are stored in BDT units; convert for display. */
export const BASE_CURRENCY: CurrencyCode = "BDT";

/**
 * Approx rates: how many units of `code` equal 1 BDT.
 * Example: 1 BDT ≈ 0.0083 USD → 1200 BDT ≈ $10.
 */
export const RATE_FROM_BDT: Record<CurrencyCode, number> = {
  BDT: 1,
  USD: 1 / 120,
  EUR: 1 / 130,
  GBP: 1 / 150,
  INR: 1 / 1.4,
  AED: 1 / 32.7,
  SAR: 1 / 32,
};

export function getCurrencyOption(code: CurrencyCode): CurrencyOption {
  return (
    CURRENCY_OPTIONS.find((c) => c.code === code) ?? CURRENCY_OPTIONS[0]!
  );
}

export function convertFromBase(
  amountInBase: number,
  to: CurrencyCode,
): number {
  const rate = RATE_FROM_BDT[to] ?? 1;
  return amountInBase * rate;
}

export function formatMoneyAmount(
  amountInBase: number,
  currencyCode: CurrencyCode = DEFAULT_CURRENCY,
): string {
  const option = getCurrencyOption(currencyCode);
  // Round to whole units so converted displays stay clean ($238 not $238.33).
  const converted = Math.round(convertFromBase(amountInBase, currencyCode));

  try {
    return new Intl.NumberFormat(option.locale, {
      style: "currency",
      currency: option.code,
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    }).format(converted);
  } catch {
    return `${option.symbol}${converted.toLocaleString(option.locale)}`;
  }
}

export function pointsRuleLabel(currencyCode: CurrencyCode): string {
  if (currencyCode === "BDT") return "1 BDT = 1 point";
  // Ledger stays in BDT; points stay 1:1 with base units while money converts.
  return `Money shown in ${currencyCode} · 1 BDT = 1 point`;
}
