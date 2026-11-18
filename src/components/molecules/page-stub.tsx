import { Badge, Card, CardDescription, CardHeader, CardTitle } from "@/components/atoms";

type PageStubProps = {
  title: string;
  phase: string;
  description: string;
};

export function PageStub({ title, phase, description }: PageStubProps) {
  return (
    <Card>
      <CardHeader className="gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{title}</Badge>
          <Badge variant="pending">{phase}</Badge>
        </div>
        <CardTitle className="font-display text-xl">{title}</CardTitle>
        <CardDescription className="max-w-2xl text-base">
          {description}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
