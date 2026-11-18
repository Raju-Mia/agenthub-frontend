"use client";

import { useState } from "react";
import {
  Field,
  SettingsPanel,
  ToggleRow,
  fieldControlClass,
} from "./settings-panel";

export function SecuritySettings() {
  const [timeoutMin, setTimeoutMin] = useState(60);
  const [savedTimeout, setSavedTimeout] = useState(60);
  const [twoFactor, setTwoFactor] = useState(false);
  const [savedTwoFactor, setSavedTwoFactor] = useState(false);
  const [saved, setSaved] = useState(false);

  const dirty =
    timeoutMin !== savedTimeout || twoFactor !== savedTwoFactor;

  return (
    <SettingsPanel
      title="Security"
      description="Session lifetime and sign-in hardening for admin accounts."
      dirty={dirty}
      saved={saved}
      onReset={() => {
        setTimeoutMin(savedTimeout);
        setTwoFactor(savedTwoFactor);
      }}
      onSave={() => {
        setSavedTimeout(timeoutMin);
        setSavedTwoFactor(twoFactor);
        setSaved(true);
        window.setTimeout(() => setSaved(false), 1400);
      }}
    >
      <Field
        label="Session timeout"
        hint="Admins are signed out after this period of inactivity."
      >
        <select
          className={`${fieldControlClass} max-w-xs`}
          value={timeoutMin}
          onChange={(e) => setTimeoutMin(Number(e.target.value))}
        >
          <option value={30}>30 minutes</option>
          <option value={60}>1 hour</option>
          <option value={240}>4 hours</option>
          <option value={480}>8 hours</option>
        </select>
      </Field>

      <ToggleRow
        label="Require two-factor authentication"
        hint="Prompt admins for a second factor at sign-in. Demo toggle only."
        checked={twoFactor}
        onChange={setTwoFactor}
      />
    </SettingsPanel>
  );
}
