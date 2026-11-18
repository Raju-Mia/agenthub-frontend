"use client";

import { useState } from "react";
import { SettingsPanel, ToggleRow } from "./settings-panel";

const INITIAL = {
  pendingJobs: true,
  awaitingAdmin: true,
  approved: false,
  rejected: true,
  deviceLocked: true,
};

export function NotificationsSettings() {
  const [draft, setDraft] = useState(INITIAL);
  const [savedDraft, setSavedDraft] = useState(INITIAL);
  const [saved, setSaved] = useState(false);
  const dirty = JSON.stringify(draft) !== JSON.stringify(savedDraft);

  function setKey(key: keyof typeof INITIAL, value: boolean) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <SettingsPanel
      title="Notifications"
      description="Choose which pipeline events send email to admins."
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
          label="New pending payment"
          hint="When a customer payment enters the ledger."
          checked={draft.pendingJobs}
          onChange={(v) => setKey("pendingJobs", v)}
        />
        <ToggleRow
          label="Awaiting admin approval"
          hint="After an agent verifies a job."
          checked={draft.awaitingAdmin}
          onChange={(v) => setKey("awaitingAdmin", v)}
        />
        <ToggleRow
          label="Approved earnings"
          hint="Confirmation when admin marks a transaction approved."
          checked={draft.approved}
          onChange={(v) => setKey("approved", v)}
        />
        <ToggleRow
          label="Rejected payments"
          checked={draft.rejected}
          onChange={(v) => setKey("rejected", v)}
        />
        <ToggleRow
          label="Device locked alerts"
          hint="When Lock App reports a newly locked device."
          checked={draft.deviceLocked}
          onChange={(v) => setKey("deviceLocked", v)}
        />
      </div>
    </SettingsPanel>
  );
}
