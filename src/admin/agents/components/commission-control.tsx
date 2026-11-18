"use client";

import { useState } from "react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from "@/components/atoms";

type CommissionControlProps = {
  initialPercent: number;
  agentName: string;
};

export function CommissionControl({
  initialPercent,
  agentName,
}: CommissionControlProps) {
  const [percent, setPercent] = useState(initialPercent);
  const [saved, setSaved] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  function save() {
    if (Number.isNaN(percent) || percent < 0 || percent > 100) {
      setError("Commission must be between 0 and 100.");
      setSaved(null);
      return;
    }
    setError(null);
    setSaved(percent);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle className="text-lg">Commission</CardTitle>
          <Badge variant="approved">Default 50%</Badge>
        </div>
        <CardDescription>
          Share of approved worker volume under {agentName}. Design-only — not
          persisted.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="space-y-2 sm:flex-1">
            <Label htmlFor="commission-edit">Commission %</Label>
            <Input
              id="commission-edit"
              type="number"
              min={0}
              max={100}
              value={percent}
              onChange={(e) => {
                setPercent(Number(e.target.value));
                setSaved(null);
              }}
            />
          </div>
          <Button type="button" onClick={save}>
            Save (demo)
          </Button>
        </div>
        {error ? (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}
        {saved !== null ? (
          <p className="text-sm text-status-approved" role="status">
            Demo saved at {saved}% — API will wire this later.
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Current mock value: {initialPercent}%
          </p>
        )}
      </CardContent>
    </Card>
  );
}
