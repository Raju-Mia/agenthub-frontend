"use client";

import { useEffect, useState } from "react";
import {
  CURRENCY_OPTIONS,
  type CurrencyCode,
  formatMoneyAmount,
} from "@/lib/currency";
import { useMoney } from "@/hooks/use-money";
import { cn } from "@/lib/utils";
import { SettingsPanel } from "./settings-panel";

const PREVIEW_AMOUNT = 1200;

export function CurrencySettings() {
  const { currency, setCurrency } = useMoney();
  const [draft, setDraft] = useState<CurrencyCode>(currency);
  const [saved, setSaved] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setDraft(currency);
    setHydrated(true);
  }, [currency]);

  function save() {
    setCurrency(draft);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1400);
  }

  if (!hydrated) {
    return (
      <div className="h-56 animate-pulse rounded-xl border border-border bg-muted/40" />
    );
  }

  const dirty = draft !== currency;

  return (
    <SettingsPanel
      title="Currency"
      description="Amounts are stored in BDT and converted for display across admin screens."
      dirty={dirty}
      saved={saved}
      onReset={() => setDraft(currency)}
      onSave={save}
    >
      <div className="flex items-baseline justify-between gap-3 rounded-lg border border-border/70 bg-muted/20 px-3.5 py-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
            Preview · 1200 BDT
          </p>
          <p className="mt-1 font-display text-2xl font-semibold tabular-nums">
            {formatMoneyAmount(PREVIEW_AMOUNT, draft)}
          </p>
        </div>
        <p className="font-mono text-xs text-muted-foreground">{draft}</p>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {CURRENCY_OPTIONS.map((option) => {
          const selected = draft === option.code;
          return (
            <button
              key={option.code}
              type="button"
              onClick={() => setDraft(option.code)}
              aria-pressed={selected}
              className={cn(
                "rounded-lg border px-3.5 py-3 text-left transition",
                selected
                  ? "border-foreground/25 bg-muted/40"
                  : "border-border/70 bg-card hover:bg-muted/30",
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  {option.code}
                </span>
                <span className="text-sm font-semibold">{option.symbol}</span>
              </div>
              <p className="mt-1 text-sm font-medium">{option.name}</p>
            </button>
          );
        })}
      </div>
    </SettingsPanel>
  );
}
