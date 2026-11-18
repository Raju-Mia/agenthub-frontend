"use client";

import { useMemo, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Badge, Button } from "@/components/atoms";
import {
  Field,
  SettingsPanel,
  fieldControlClass,
} from "./settings-panel";

type SocialPlatform =
  | "facebook"
  | "instagram"
  | "whatsapp"
  | "telegram"
  | "x"
  | "linkedin"
  | "youtube"
  | "tiktok"
  | "website"
  | "other";

type SocialAccount = {
  id: string;
  platform: SocialPlatform;
  label: string;
  handle: string;
  url: string;
  notes: string;
};

const EMPTY_FORM: Omit<SocialAccount, "id"> = {
  platform: "facebook",
  label: "",
  handle: "",
  url: "",
  notes: "",
};

const SEED: SocialAccount[] = [
  {
    id: "sa-1",
    platform: "facebook",
    label: "Official page",
    handle: "@agenthub.official",
    url: "https://facebook.com/agenthub.official",
    notes: "Public customer support page",
  },
  {
    id: "sa-2",
    platform: "whatsapp",
    label: "Support WhatsApp",
    handle: "+8801700000001",
    url: "https://wa.me/8801700000001",
    notes: "Business chat line",
  },
  {
    id: "sa-3",
    platform: "website",
    label: "Company website",
    handle: "agenthub.local",
    url: "https://agenthub.local",
    notes: "",
  },
];

function platformLabel(platform: SocialPlatform) {
  const map: Record<SocialPlatform, string> = {
    facebook: "Facebook",
    instagram: "Instagram",
    whatsapp: "WhatsApp",
    telegram: "Telegram",
    x: "X / Twitter",
    linkedin: "LinkedIn",
    youtube: "YouTube",
    tiktok: "TikTok",
    website: "Website",
    other: "Other",
  };
  return map[platform];
}

export function SocialAccountsSettings() {
  const [accounts, setAccounts] = useState<SocialAccount[]>(SEED);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [notice, setNotice] = useState<string | null>(null);

  const editing = useMemo(
    () => accounts.find((a) => a.id === editingId) ?? null,
    [accounts, editingId],
  );

  function flash(text: string) {
    setNotice(text);
    window.setTimeout(() => setNotice(null), 1600);
  }

  function startCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  function startEdit(account: SocialAccount) {
    setEditingId(account.id);
    setForm({
      platform: account.platform,
      label: account.label,
      handle: account.handle,
      url: account.url,
      notes: account.notes,
    });
  }

  function saveAccount() {
    if (!form.label.trim() || !form.handle.trim()) {
      flash("Label and handle / number are required.");
      return;
    }

    if (editing) {
      setAccounts((prev) =>
        prev.map((a) => (a.id === editing.id ? { ...a, ...form } : a)),
      );
      flash("Social account updated");
    } else {
      setAccounts((prev) => [
        ...prev,
        { id: `sa-${Date.now()}`, ...form },
      ]);
      flash("Social account added");
    }
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  function removeAccount(id: string) {
    setAccounts((prev) => prev.filter((a) => a.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setForm(EMPTY_FORM);
    }
    flash("Social account removed");
  }

  return (
    <div className="space-y-5">
      {notice ? (
        <p
          className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm"
          role="status"
        >
          {notice}
        </p>
      ) : null}

      <SettingsPanel
        title="Business social accounts"
        description="Store official pages and messaging channels used for customer communication."
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground">
            {accounts.length} account{accounts.length === 1 ? "" : "s"}
          </p>
          <Button type="button" variant="outline" size="sm" onClick={startCreate}>
            <Plus className="size-3.5" />
            Add account
          </Button>
        </div>

        {accounts.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
            No social accounts yet.
          </p>
        ) : (
          <ul className="space-y-2">
            {accounts.map((account) => (
              <li
                key={account.id}
                className="rounded-xl border border-border/70 px-4 py-3"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold">{account.label}</p>
                      <Badge variant="outline" className="font-normal">
                        {platformLabel(account.platform)}
                      </Badge>
                    </div>
                    <p className="font-mono text-xs text-foreground">
                      {account.handle}
                    </p>
                    {account.url ? (
                      <a
                        href={account.url}
                        target="_blank"
                        rel="noreferrer"
                        className="block truncate text-xs text-muted-foreground hover:underline"
                      >
                        {account.url}
                      </a>
                    ) : null}
                    {account.notes ? (
                      <p className="text-xs text-muted-foreground">
                        {account.notes}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-0.5">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="size-8 p-0 text-muted-foreground"
                      title="Edit"
                      onClick={() => startEdit(account)}
                    >
                      <Pencil className="size-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="size-8 p-0 text-muted-foreground"
                      title="Delete"
                      onClick={() => removeAccount(account.id)}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </SettingsPanel>

      <SettingsPanel
        title={editing ? "Edit social account" : "Add social account"}
        description="Facebook, Instagram, WhatsApp, Telegram, LinkedIn, website, and more."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Platform">
            <select
              className={fieldControlClass}
              value={form.platform}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  platform: e.target.value as SocialPlatform,
                }))
              }
            >
              <option value="facebook">Facebook</option>
              <option value="instagram">Instagram</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="telegram">Telegram</option>
              <option value="x">X / Twitter</option>
              <option value="linkedin">LinkedIn</option>
              <option value="youtube">YouTube</option>
              <option value="tiktok">TikTok</option>
              <option value="website">Website</option>
              <option value="other">Other</option>
            </select>
          </Field>
          <Field label="Display label">
            <input
              className={fieldControlClass}
              placeholder="Official page"
              value={form.label}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, label: e.target.value }))
              }
            />
          </Field>
          <Field label="Handle / number">
            <input
              className={fieldControlClass}
              placeholder="@agenthub or +8801…"
              value={form.handle}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, handle: e.target.value }))
              }
            />
          </Field>
          <Field label="Profile URL">
            <input
              className={fieldControlClass}
              placeholder="https://"
              value={form.url}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, url: e.target.value }))
              }
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Notes">
              <input
                className={fieldControlClass}
                placeholder="Used for customer support"
                value={form.notes}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, notes: e.target.value }))
                }
              />
            </Field>
          </div>
        </div>

        <div className="flex flex-wrap justify-end gap-2 border-t border-border/60 pt-4">
          {(editing || form.label || form.handle) && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setEditingId(null);
                setForm(EMPTY_FORM);
              }}
            >
              Clear
            </Button>
          )}
          <Button type="button" variant="outline" onClick={saveAccount}>
            {editing ? "Update account" : "Save account"}
          </Button>
        </div>
      </SettingsPanel>
    </div>
  );
}
