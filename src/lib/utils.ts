import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  DEFAULT_CURRENCY,
  formatMoneyAmount,
  type CurrencyCode,
} from "@/lib/currency";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Prefer `useMoney().format` or `<MoneyText />` so Settings currency applies. */
export function formatMoney(
  amountInBase: number,
  currency: CurrencyCode = DEFAULT_CURRENCY,
): string {
  return formatMoneyAmount(amountInBase, currency);
}

/** @deprecated Use formatMoney / useMoney / MoneyText */
export function formatTk(amount: number): string {
  return formatMoneyAmount(amount, DEFAULT_CURRENCY);
}

export function formatPoints(points: number): string {
  return `${points.toLocaleString("en-US")} pts`;
}

/** Base ledger unit converts 1:1 into points after currency conversion display. */
export function amountToPoints(amountInBase: number): number {
  return amountInBase;
}
