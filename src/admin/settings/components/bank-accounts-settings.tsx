"use client";

import { useMemo, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Badge, Button } from "@/components/atoms";
import {
  Field,
  SettingsPanel,
  fieldControlClass,
} from "./settings-panel";

type AccountType = "bank" | "wallet" | "intl";

type BankAccount = {
  id: string;
  label: string;
  type: AccountType;
  bankName: string;
  accountName: string;
  accountNumber: string;
  iban: string;
  swift: string;
  country: string;
  currency: string;
  branch: string;
  notes: string;
  isDefault: boolean;
};

const EMPTY_FORM: Omit<BankAccount, "id" | "isDefault"> = {
  label: "",
  type: "bank",
  bankName: "",
  accountName: "",
  accountNumber: "",
  iban: "",
  swift: "",
  country: "BD",
  currency: "BDT",
  branch: "",
  notes: "",
};

const SEED: BankAccount[] = [
  {
    id: "ba-1",
    label: "Main BD payout",
    type: "bank",
    bankName: "BRAC Bank",
    accountName: "Agent Hub Ltd",
    accountNumber: "150320********",
    iban: "",
    swift: "BRAKBDDH",
    country: "BD",
    currency: "BDT",
    branch: "Gulshan",
    notes: "Primary local receiving account",
    isDefault: true,
  },
  {
    id: "ba-2",
    label: "International USD",
    type: "intl",
    bankName: "Wise Business",
    accountName: "Agent Hub Ltd",
    accountNumber: "8310********",
    iban: "BE71 9674 **** ****",
    swift: "TRWIBEB1XXX",
    country: "BE",
    currency: "USD",
    branch: "",
    notes: "Accepts USD / EUR wire transfers",
    isDefault: false,
  },
];

function typeLabel(type: AccountType) {
  if (type === "wallet") return "Wallet";
  if (type === "intl") return "International";
  return "Bank";
}

export function BankAccountsSettings() {
  const [accounts, setAccounts] = useState<BankAccount[]>(SEED);
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

  function startEdit(account: BankAccount) {
    setEditingId(account.id);
    setForm({
      label: account.label,
      type: account.type,
      bankName: account.bankName,
      accountName: account.accountName,
      accountNumber: account.accountNumber,
      iban: account.iban,
      swift: account.swift,
      country: account.country,
      currency: account.currency,
      branch: account.branch,
      notes: account.notes,
    });
  }

  function saveAccount() {
    if (!form.label.trim() || !form.bankName.trim() || !form.accountName.trim()) {
      flash("Label, bank, and account name are required.");
      return;
    }

    if (editing) {
      setAccounts((prev) =>
        prev.map((a) => (a.id === editing.id ? { ...a, ...form } : a)),
      );
      flash("Account updated");
    } else {
      const id = `ba-${Date.now()}`;
      setAccounts((prev) => [
        ...prev,
        {
          id,
          ...form,
          isDefault: prev.length === 0,
        },
      ]);
      flash("Account added");
    }
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  function removeAccount(id: string) {
    setAccounts((prev) => {
      const next = prev.filter((a) => a.id !== id);
      if (next.length && !next.some((a) => a.isDefault)) {
        next[0] = { ...next[0]!, isDefault: true };
      }
      return next;
    });
    if (editingId === id) {
      setEditingId(null);
      setForm(EMPTY_FORM);
    }
    flash("Account removed");
  }

  function setDefault(id: string) {
    setAccounts((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id })),
    );
    flash("Default payout account set");
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
        title="Saved payment accounts"
        description="Local banks, mobile wallets, and international accounts for receiving customer payments."
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
            No accounts yet. Add a bank, wallet, or international receiving
            account.
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
                        {typeLabel(account.type)}
                      </Badge>
                      {account.isDefault ? (
                        <Badge variant="secondary">Default</Badge>
                      ) : null}
                    </div>
                    <p className="text-sm text-foreground">
                      {account.bankName} · {account.accountName}
                    </p>
                    <p className="font-mono text-xs text-muted-foreground">
                      {account.accountNumber}
                      {account.iban ? ` · IBAN ${account.iban}` : ""}
                      {account.swift ? ` · SWIFT ${account.swift}` : ""}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {account.country} · {account.currency}
                      {account.branch ? ` · ${account.branch}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {!account.isDefault ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 text-xs text-muted-foreground"
                        onClick={() => setDefault(account.id)}
                      >
                        Set default
                      </Button>
                    ) : null}
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
        title={editing ? "Edit account" : "Add account"}
        description="Supports local banks, mobile wallets (bKash / Nagad), and international IBAN / SWIFT details."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Display label">
            <input
              className={fieldControlClass}
              placeholder="Main BD payout"
              value={form.label}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, label: e.target.value }))
              }
            />
          </Field>
          <Field label="Account type">
            <select
              className={fieldControlClass}
              value={form.type}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  type: e.target.value as AccountType,
                }))
              }
            >
              <option value="bank">Local bank</option>
              <option value="wallet">Mobile wallet</option>
              <option value="intl">International</option>
            </select>
          </Field>
          <Field label="Bank / provider">
            <input
              className={fieldControlClass}
              placeholder="BRAC Bank / Wise / bKash"
              value={form.bankName}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, bankName: e.target.value }))
              }
            />
          </Field>
          <Field label="Account holder name">
            <input
              className={fieldControlClass}
              value={form.accountName}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, accountName: e.target.value }))
              }
            />
          </Field>
          <Field label="Account number">
            <input
              className={fieldControlClass}
              value={form.accountNumber}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  accountNumber: e.target.value,
                }))
              }
            />
          </Field>
          <Field label="Branch" hint="Optional for wallets.">
            <input
              className={fieldControlClass}
              value={form.branch}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, branch: e.target.value }))
              }
            />
          </Field>
          <Field label="IBAN" hint="For international receiving accounts.">
            <input
              className={fieldControlClass}
              placeholder="BE71 …"
              value={form.iban}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, iban: e.target.value }))
              }
            />
          </Field>
          <Field label="SWIFT / BIC">
            <input
              className={fieldControlClass}
              placeholder="BRAKBDDH"
              value={form.swift}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, swift: e.target.value }))
              }
            />
          </Field>
          <Field label="Country">
            <select
              className={fieldControlClass}
              value={form.country}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, country: e.target.value }))
              }
            >
              <option value="BD">Bangladesh</option>
              <option value="US">United States</option>
              <option value="GB">United Kingdom</option>
              <option value="AE">United Arab Emirates</option>
              <option value="SA">Saudi Arabia</option>
              <option value="BE">Belgium</option>
              <option value="IN">India</option>
              <option value="SG">Singapore</option>
            </select>
          </Field>
          <Field label="Currency">
            <select
              className={fieldControlClass}
              value={form.currency}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, currency: e.target.value }))
              }
            >
              <option value="BDT">BDT</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="AED">AED</option>
              <option value="SAR">SAR</option>
              <option value="INR">INR</option>
            </select>
          </Field>
          <div className="sm:col-span-2">
            <Field label="Notes">
              <input
                className={fieldControlClass}
                placeholder="Primary receiving account for customer payments"
                value={form.notes}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, notes: e.target.value }))
                }
              />
            </Field>
          </div>
        </div>

        <div className="flex flex-wrap justify-end gap-2 border-t border-border/60 pt-4">
          {(editing || form.label || form.bankName) && (
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
