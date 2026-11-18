"use client";

import { useState } from "react";
import {
  Field,
  SettingsPanel,
  ToggleRow,
  fieldControlClass,
} from "./settings-panel";

export function LockAppSettings() {
  const [syncMin, setSyncMin] = useState(5);
  const [savedSync, setSavedSync] = useState(5);
  const [autoLock, setAutoLock] = useState(true);
  const [savedAutoLock, setSavedAutoLock] = useState(true);
  const [locationPing, setLocationPing] = useState(true);
  const [savedLocation, setSavedLocation] = useState(true);
  const [saved, setSaved] = useState(false);

  const dirty =
    syncMin !== savedSync ||
    autoLock !== savedAutoLock ||
    locationPing !== savedLocation;

  return (
    <SettingsPanel
      title="Lock App"
      description="How installed devices report status, location, and access data."
      dirty={dirty}
      saved={saved}
      onReset={() => {
        setSyncMin(savedSync);
        setAutoLock(savedAutoLock);
        setLocationPing(savedLocation);
      }}
      onSave={() => {
        setSavedSync(syncMin);
        setSavedAutoLock(autoLock);
        setSavedLocation(locationPing);
        setSaved(true);
        window.setTimeout(() => setSaved(false), 1400);
      }}
    >
      <Field
        label="Device sync interval"
        hint="How often devices push status and location to Agent Hub."
      >
        <select
          className={`${fieldControlClass} max-w-xs`}
          value={syncMin}
          onChange={(e) => setSyncMin(Number(e.target.value))}
        >
          <option value={1}>Every 1 minute</option>
          <option value={5}>Every 5 minutes</option>
          <option value={15}>Every 15 minutes</option>
          <option value={30}>Every 30 minutes</option>
        </select>
      </Field>

      <div className="space-y-2">
        <ToggleRow
          label="Auto-lock on install"
          hint="Lock the device when Lock App finishes setup."
          checked={autoLock}
          onChange={setAutoLock}
        />
        <ToggleRow
          label="Share current location"
          hint="Show live location on device and customer profiles."
          checked={locationPing}
          onChange={setLocationPing}
        />
      </div>
    </SettingsPanel>
  );
}
