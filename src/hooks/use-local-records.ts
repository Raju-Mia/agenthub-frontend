"use client";

import { useCallback, useMemo, useState } from "react";

/** Client-side soft-delete for static demo lists. */
export function useLocalRecords<T extends { id: string }>(initial: T[]) {
  const [removedIds, setRemovedIds] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  const records = useMemo(
    () => initial.filter((row) => !removedIds.includes(row.id)),
    [initial, removedIds],
  );

  const remove = useCallback((id: string, label?: string) => {
    setRemovedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setToast(
      label
        ? `Removed “${label}” from this session (demo — no API).`
        : "Removed from this session (demo — no API).",
    );
    window.setTimeout(() => setToast(null), 2200);
  }, []);

  return { records, remove, toast, setToast };
}
