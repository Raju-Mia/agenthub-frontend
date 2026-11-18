import Link from "next/link";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/atoms";
import { buttonVariants } from "@/components/atoms";
import { cn } from "@/lib/utils";

type RolePlaceholderProps = {
  role: "Admin" | "Agent" | "Worker";
  nextPhase: string;
  notes?: string[];
};

export function RolePlaceholder({
  role,
  nextPhase,
  notes = [],
}: RolePlaceholderProps) {
  return (
    <div className="bg-mesh flex min-h-svh flex-col items-center justify-center px-6 py-16">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Badge variant="approved">{role}</Badge>
            <Badge variant="pending">Placeholder</Badge>
          </div>
          <CardTitle className="font-display text-2xl pt-2">
            {role} dashboard coming next
          </CardTitle>
          <CardDescription>
            Login demo routed here successfully. Full shell ships in{" "}
            {nextPhase}.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {notes.length > 0 ? (
            <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              {notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          ) : null}
          <div className="flex flex-wrap gap-3">
            <Link href="/login" className={cn(buttonVariants())}>
              Back to login
            </Link>
            <Link
              href="/"
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              Welcome
            </Link>
            <Button variant="ghost" disabled>
              Shell ({nextPhase})
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
