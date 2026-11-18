"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Menu } from "lucide-react";
import { getAgentPageTitle } from "@/features/agent/constants/nav";
import { getDemoAgent } from "@/mocks";
import { Badge, Button, buttonVariants } from "@/components/atoms";
import { cn } from "@/lib/utils";

type AgentHeaderProps = {
  onMenuClick: () => void;
};

export function AgentHeader({ onMenuClick }: AgentHeaderProps) {
  const pathname = usePathname();
  const title = getAgentPageTitle(pathname);
  const agent = getDemoAgent();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-card/90 px-4 backdrop-blur sm:px-6">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <Menu />
      </Button>

      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-lg font-semibold tracking-tight text-foreground">
          {title}
        </p>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <Badge variant="secondary" className="hidden sm:inline-flex">
          Agent
        </Badge>
        <span className="hidden max-w-[10rem] truncate font-mono text-xs text-muted-foreground md:inline">
          {agent.serial}
        </span>
        <Link
          href="/login"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "gap-1.5",
          )}
        >
          <LogOut className="size-3.5" />
          <span className="hidden sm:inline">Logout</span>
        </Link>
      </div>
    </header>
  );
}
