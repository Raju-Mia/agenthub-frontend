"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  Clock3,
  Globe2,
  LogOut,
  Maximize2,
  Menu,
  Minimize2,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Type,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/atoms";
import { cn } from "@/lib/utils";

type AdminHeaderProps = {
  onMenuClick: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
};

function LiveClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  if (!now) {
    return (
      <div
        className="hidden h-9 w-44 rounded-full bg-slate-100 md:block"
        aria-hidden
      />
    );
  }

  const time = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZone: "Asia/Dhaka",
  }).format(now);

  return (
    <div className="hidden items-center gap-2 rounded-full bg-slate-100/90 px-3.5 py-1.5 md:inline-flex">
      <Clock3 className="size-3.5 text-slate-500" aria-hidden />
      <span className="font-mono text-[13px] font-medium tabular-nums text-slate-800">
        {time}
      </span>
      <span className="rounded-md bg-teal-600 px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-white">
        BST
      </span>
    </div>
  );
}

function IconAction({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className="inline-flex size-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
    >
      {children}
    </button>
  );
}

export function AdminHeader({
  onMenuClick,
  collapsed,
  onToggleCollapse,
}: AdminHeaderProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onFsChange() {
      setIsFullscreen(Boolean(document.fullscreenElement));
    }
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  async function toggleFullscreen() {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // Browser may block fullscreen in some contexts
    }
  }

  return (
    <header className="sticky top-0 z-30 h-14 border-b border-slate-200/80 bg-white sm:h-[3.75rem]">
      <div className="relative flex h-full items-center gap-2 px-3 sm:px-5 lg:px-6">
        <div className="flex min-w-0 items-center gap-1.5">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-slate-600 hover:bg-slate-100 lg:hidden"
            onClick={onMenuClick}
            aria-label="Open menu"
          >
            <Menu />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="hidden text-slate-600 hover:bg-slate-100 lg:inline-flex"
            onClick={onToggleCollapse}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
          </Button>
          <p className="truncate text-sm font-medium text-slate-800 sm:text-[15px]">
            Admin
          </p>
        </div>

        <div className="pointer-events-none absolute inset-x-0 flex justify-center">
          <div className="pointer-events-auto">
            <LiveClock />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-1 sm:gap-1.5">
          <div className="hidden items-center gap-0.5 sm:flex">
            <IconAction label="Language">
              <Globe2 className="size-4" />
            </IconAction>
            <IconAction
              label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
              onClick={toggleFullscreen}
            >
              {isFullscreen ? (
                <Minimize2 className="size-4" />
              ) : (
                <Maximize2 className="size-4" />
              )}
            </IconAction>
            <IconAction label="Appearance">
              <Moon className="size-4" />
            </IconAction>
            <IconAction label="Font size">
              <Type className="size-4" />
            </IconAction>
          </div>

          <div className="mx-1 hidden h-6 w-px bg-slate-200 sm:block" />

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 rounded-xl py-1 pl-1 pr-1.5 transition hover:bg-slate-50 sm:pr-2"
              aria-expanded={menuOpen}
              aria-haspopup="menu"
            >
              <span className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-teal-700 text-xs font-semibold text-white ring-2 ring-teal-100">
                AH
              </span>
              <span className="hidden min-w-0 text-left sm:block">
                <span className="block truncate text-sm font-semibold text-slate-900">
                  AgentHub Admin
                </span>
                <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-600">
                  Admin
                </span>
              </span>
              <ChevronDown
                className={cn(
                  "hidden size-4 text-slate-400 transition sm:block",
                  menuOpen && "rotate-180",
                )}
              />
            </button>

            {menuOpen ? (
              <div
                role="menu"
                className="absolute right-0 top-[calc(100%+0.4rem)] z-50 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg shadow-slate-900/10"
              >
                <Link
                  href="/admin/profile"
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  <UserRound className="size-4 text-slate-400" />
                  Profile
                </Link>
                <Link
                  href="/login"
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  <LogOut className="size-4 text-slate-400" />
                  Logout
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
