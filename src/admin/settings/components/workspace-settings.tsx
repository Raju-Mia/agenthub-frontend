"use client";

import { useState } from "react";
import {
  Field,
  SettingsPanel,
  fieldControlClass,
} from "./settings-panel";

const INITIAL = {
  orgName: "Agent Hub",
  supportEmail: "admin@agenthub.local",
  timezone: "Asia/Dhaka",
  locale: "en-GB",
};

export function WorkspaceSettings() {
  const [draft, setDraft] = useState(INITIAL);
  const [savedDraft, setSavedDraft] = useState(INITIAL);
  const [saved, setSaved] = useState(false);

  const dirty = JSON.stringify(draft) !== JSON.stringify(savedDraft);

  return (
    <SettingsPanel
      title="Company profile"
      description="Organization identity and regional defaults for the control room."
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
        <Field label="Organization name">
          <input
            className={fieldControlClass}
            value={draft.orgName}
            onChange={(e) =>
              setDraft((prev) => ({ ...prev, orgName: e.target.value }))
            }
          />
        </Field>
        <Field label="Support email" hint="Used on admin alerts and receipts.">
          <input
            type="email"
            className={fieldControlClass}
            value={draft.supportEmail}
            onChange={(e) =>
              setDraft((prev) => ({ ...prev, supportEmail: e.target.value }))
            }
          />
        </Field>
        <Field label="Timezone">
          <select
            className={fieldControlClass}
            value={draft.timezone}
            onChange={(e) =>
              setDraft((prev) => ({ ...prev, timezone: e.target.value }))
            }
          >
            <option value="Asia/Dhaka">Asia/Dhaka (BST)</option>
            <option value="UTC">UTC</option>
            <option value="Asia/Dubai">Asia/Dubai</option>
            <option value="Europe/London">Europe/London</option>
          </select>
        </Field>
        <Field label="Date locale">
          <select
            className={fieldControlClass}
            value={draft.locale}
            onChange={(e) =>
              setDraft((prev) => ({ ...prev, locale: e.target.value }))
            }
          >
            <option value="en-GB">English (UK)</option>
            <option value="en-US">English (US)</option>
            <option value="bn-BD">Bangla (BD)</option>
          </select>
        </Field>
      </div>
    </SettingsPanel>
  );
}
