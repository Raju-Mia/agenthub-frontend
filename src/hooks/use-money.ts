"use client";

import {
  formatMoneyAmount,
  pointsRuleLabel,
} from "@/lib/currency";
import { useCurrencyStore } from "@/store/use-currency-store";

export function useMoney() {
  const currency = useCurrencyStore((s) => s.currency);
  const setCurrency = useCurrencyStore((s) => s.setCurrency);

  return {
    currency,
    setCurrency,
    format: (amountInBase: number) => formatMoneyAmount(amountInBase, currency),
    pointsRule: pointsRuleLabel(currency),
  };
}
