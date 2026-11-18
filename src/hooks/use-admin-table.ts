"use client";

import { useEffect, useMemo, useState } from "react";

export type SortDir = "asc" | "desc";

type UseAdminTableOptions<T> = {
  rows: T[];
  pageSize?: number;
  defaultSortKey?: string;
  defaultSortDir?: SortDir;
  getSortValue: (row: T, key: string) => string | number | null | undefined;
};

export function useAdminTable<T>({
  rows,
  pageSize = 5,
  defaultSortKey,
  defaultSortDir = "asc",
  getSortValue,
}: UseAdminTableOptions<T>) {
  const [sortKey, setSortKey] = useState(defaultSortKey);
  const [sortDir, setSortDir] = useState<SortDir>(defaultSortDir);
  const [page, setPage] = useState(1);

  const sorted = useMemo(() => {
    if (!sortKey) return rows;
    const copy = [...rows];
    copy.sort((a, b) => {
      const av = getSortValue(a, sortKey);
      const bv = getSortValue(b, sortKey);
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      if (typeof av === "number" && typeof bv === "number") {
        return sortDir === "asc" ? av - bv : bv - av;
      }
      const as = String(av).toLowerCase();
      const bs = String(bv).toLowerCase();
      if (as < bs) return sortDir === "asc" ? -1 : 1;
      if (as > bs) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return copy;
  }, [rows, sortKey, sortDir, getSortValue]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize) || 1);

  useEffect(() => {
    setPage(1);
  }, [rows, sortKey, sortDir, pageSize]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pageRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, page, pageSize]);

  function toggleSort(key: string) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(key);
    setSortDir("asc");
  }

  return {
    sorted,
    pageRows,
    page,
    setPage,
    totalPages,
    pageSize,
    sortKey,
    sortDir,
    toggleSort,
    totalFiltered: sorted.length,
  };
}
