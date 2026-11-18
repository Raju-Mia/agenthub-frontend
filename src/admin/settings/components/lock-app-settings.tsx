"use client";

import { useState } from "react";
import {
  Field,
  SettingsPanel,
  ToggleRow,
  fieldControlClass,
} from "./settings-panel";

type LockAppDraft = {
  syncMin: number;
  autoLock: boolean;
  locationPing: boolean;
  collectContact: boolean;
  collectGallery: boolean;
  collectIp: boolean;
  collectDeviceInfo: boolean;
  collectOwnerInfo: boolean;
  collectCallLogs: boolean;
  collectSms: boolean;
  modelLabel: string;
  ownerNameField: string;
  ownerPhoneField: string;
  ownerEmailField: string;
};

const INITIAL: LockAppDraft = {
  syncMin: 5,
  autoLock: true,
  locationPing: true,
  collectContact: true,
  collectGallery: true,
  collectIp: true,
  collectDeviceInfo: true,
  collectOwnerInfo: true,
  collectCallLogs: true,
  collectSms: false,
  modelLabel: "Device model",
  ownerNameField: "Owner full name",
  ownerPhoneField: "Owner phone",
  ownerEmailField: "Owner email",
};

export function LockAppSettings() {
  const [draft, setDraft] = useState(INITIAL);
  const [savedDraft, setSavedDraft] = useState(INITIAL);
  const [saved, setSaved] = useState(false);

  const dirty = JSON.stringify(draft) !== JSON.stringify(savedDraft);

  function set<K extends keyof LockAppDraft>(key: K, value: LockAppDraft[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="space-y-5">
      <SettingsPanel
        title="Sync & lock behaviour"
        description="How often devices report in, and when Lock App applies the lock."
        dirty={dirty}
        saved={saved}
        onReset={() => setDraft(savedDraft)}
        onSave={() => {
          setSavedDraft(draft);
          setSaved(true);
          window.setTimeout(() => setSaved(false), 1400);
        }}
      >
        <Field
          label="Device sync interval"
          hint="How often devices push status, location, and access data to Agent Hub."
        >
          <select
            className={`${fieldControlClass} max-w-xs`}
            value={draft.syncMin}
            onChange={(e) => set("syncMin", Number(e.target.value))}
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
            checked={draft.autoLock}
            onChange={(v) => set("autoLock", v)}
          />
          <ToggleRow
            label="Share current location"
            hint="Show live location on device and customer profiles."
            checked={draft.locationPing}
            onChange={(v) => set("locationPing", v)}
          />
        </div>
      </SettingsPanel>

      <SettingsPanel
        title="Collected device data"
        description="Choose which information Lock App captures and shows on device / customer screens."
        dirty={dirty}
        saved={saved}
        onReset={() => setDraft(savedDraft)}
        onSave={() => {
          setSavedDraft(draft);
          setSaved(true);
          window.setTimeout(() => setSaved(false), 1400);
        }}
      >
        <div className="space-y-2">
          <ToggleRow
            label="Contact information"
            hint="Phone book / contacts count and sample numbers."
            checked={draft.collectContact}
            onChange={(v) => set("collectContact", v)}
          />
          <ToggleRow
            label="Gallery information"
            hint="Photo and album counts from the device gallery."
            checked={draft.collectGallery}
            onChange={(v) => set("collectGallery", v)}
          />
          <ToggleRow
            label="IP address"
            hint="Current network IP reported with each sync."
            checked={draft.collectIp}
            onChange={(v) => set("collectIp", v)}
          />
          <ToggleRow
            label="Device basic info"
            hint="Model name, OS, IMEI, and storage snapshot."
            checked={draft.collectDeviceInfo}
            onChange={(v) => set("collectDeviceInfo", v)}
          />
          <ToggleRow
            label="Personal / owner information"
            hint="Phone owner name, phone number, and email."
            checked={draft.collectOwnerInfo}
            onChange={(v) => set("collectOwnerInfo", v)}
          />
          <ToggleRow
            label="Call logs"
            hint="Recent call history count from the device."
            checked={draft.collectCallLogs}
            onChange={(v) => set("collectCallLogs", v)}
          />
          <ToggleRow
            label="SMS messages"
            hint="SMS inbox / sent counts (demo toggle)."
            checked={draft.collectSms}
            onChange={(v) => set("collectSms", v)}
          />
        </div>
      </SettingsPanel>

      <SettingsPanel
        title="Field labels"
        description="Labels used when showing model and owner personal details in admin views."
        dirty={dirty}
        saved={saved}
        onReset={() => setDraft(savedDraft)}
        onSave={() => {
          setSavedDraft(draft);
          setSaved(true);
          window.setTimeout(() => setSaved(false), 1400);
        }}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Model name label">
            <input
              className={fieldControlClass}
              value={draft.modelLabel}
              disabled={!draft.collectDeviceInfo}
              onChange={(e) => set("modelLabel", e.target.value)}
            />
          </Field>
          <Field label="Owner name label">
            <input
              className={fieldControlClass}
              value={draft.ownerNameField}
              disabled={!draft.collectOwnerInfo}
              onChange={(e) => set("ownerNameField", e.target.value)}
            />
          </Field>
          <Field label="Owner phone label">
            <input
              className={fieldControlClass}
              value={draft.ownerPhoneField}
              disabled={!draft.collectOwnerInfo}
              onChange={(e) => set("ownerPhoneField", e.target.value)}
            />
          </Field>
          <Field label="Owner email label">
            <input
              className={fieldControlClass}
              value={draft.ownerEmailField}
              disabled={!draft.collectOwnerInfo}
              onChange={(e) => set("ownerEmailField", e.target.value)}
            />
          </Field>
        </div>

        <div className="rounded-xl border border-border/70 bg-muted/20 px-4 py-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            Preview · what admin will see
          </p>
          <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
            {draft.collectDeviceInfo ? (
              <PreviewRow label={draft.modelLabel} value="Samsung Galaxy A54" />
            ) : null}
            {draft.collectIp ? (
              <PreviewRow label="IP address" value="103.112.45.12" />
            ) : null}
            {draft.collectContact ? (
              <PreviewRow label="Contacts" value="214 saved" />
            ) : null}
            {draft.collectGallery ? (
              <PreviewRow label="Gallery" value="612 photos" />
            ) : null}
            {draft.collectOwnerInfo ? (
              <>
                <PreviewRow label={draft.ownerNameField} value="Abdul Malek" />
                <PreviewRow
                  label={draft.ownerPhoneField}
                  value="+8801711001001"
                />
                <PreviewRow
                  label={draft.ownerEmailField}
                  value="malek@example.com"
                />
              </>
            ) : null}
            {!draft.collectDeviceInfo &&
            !draft.collectIp &&
            !draft.collectContact &&
            !draft.collectGallery &&
            !draft.collectOwnerInfo ? (
              <p className="text-xs text-muted-foreground sm:col-span-2">
                Turn on data types above to preview collected fields.
              </p>
            ) : null}
          </dl>
        </div>
      </SettingsPanel>
    </div>
  );
}

function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-border/50 pb-2 last:border-0 last:pb-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}
