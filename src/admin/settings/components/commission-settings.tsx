"use client";

import { useState } from "react";
import {
  Field,
  SettingsPanel,
  fieldControlClass,
} from "./settings-panel";

export function CommissionSettings() {
  const [percent, setPercent] = useState(50);
  const [savedPercent, setSavedPercent] = useState(50);
  const [saved, setSaved] = useState(false);

  const dirty = percent !== savedPercent;
  const workerShare = Math.max(0, 100 - percent);

  return (
    <SettingsPanel
      title="Commission"
      description="Default split on approved unlock jobs. Agents can override per profile."
      dirty={dirty}
      saved={saved}
      onReset={() => setPercent(savedPercent)}
      onSave={() => {
        setSavedPercent(percent);
        setSaved(true);
        window.setTimeout(() => setSaved(false), 1400);
      }}
    >
      <Field
        label="Default agent commission"
        hint="Applied when a new agent is created. Existing agents keep their own rate."
      >
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            max={100}
            className={`${fieldControlClass} max-w-[8rem]`}
            value={percent}
            onChange={(e) =>
              setPercent(Math.min(100, Math.max(0, Number(e.target.value) || 0)))
            }
          />
          <span className="text-sm text-muted-foreground">%</span>
        </div>
      </Field>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-border/70 px-3.5 py-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
            Agent share
          </p>
          <p className="mt-1 font-display text-2xl font-semibold tabular-nums">
            {percent}%
          </p>
        </div>
        <div className="rounded-lg border border-border/70 px-3.5 py-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
            Worker share
          </p>
          <p className="mt-1 font-display text-2xl font-semibold tabular-nums">
            {workerShare}%
          </p>
        </div>
      </div>
    </SettingsPanel>
  );
}
