"use client";

import { useMoney } from "@/hooks/use-money";
import { cn } from "@/lib/utils";

type MoneyTextProps = {
  amount: number;
  className?: string;
};

/** Client money display — follows Admin Settings currency. */
export function MoneyText({ amount, className }: MoneyTextProps) {
  const { format } = useMoney();
  return <span className={cn(className)}>{format(amount)}</span>;
}

type PointsRuleTextProps = {
  className?: string;
  prefix?: string;
};

export function PointsRuleText({
  className,
  prefix = "",
}: PointsRuleTextProps) {
  const { pointsRule } = useMoney();
  return (
    <span className={cn(className)}>
      {prefix}
      {pointsRule}
    </span>
  );
}
