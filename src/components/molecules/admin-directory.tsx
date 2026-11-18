import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/atoms";
import { EmptyState } from "./empty-state";

type AdminDirectoryProps = {
  title?: string;
  filteredCount: number;
  totalCount: number;
  noun: string;
  toolbar?: React.ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  isEmpty: boolean;
  footer?: React.ReactNode;
  children: React.ReactNode;
};

export function AdminDirectory({
  title = "Directory",
  filteredCount,
  totalCount,
  noun,
  toolbar,
  emptyTitle,
  emptyDescription,
  isEmpty,
  footer,
  children,
}: AdminDirectoryProps) {
  return (
    <Card className="admin-card border-border/80">
      <CardHeader className="gap-4 space-y-0 border-b border-border/60 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1.5">
          <CardTitle className="text-base">{title}</CardTitle>
          <CardDescription>
            {filteredCount} of {totalCount} {noun}
          </CardDescription>
        </div>
        {toolbar ? (
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:flex-wrap lg:w-auto">
            {toolbar}
          </div>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        {isEmpty ? (
          <EmptyState
            title={emptyTitle ?? `No ${noun} match this filter.`}
            description={
              emptyDescription ?? "Try clearing search or changing filters."
            }
          />
        ) : (
          children
        )}
        {footer}
      </CardContent>
    </Card>
  );
}
