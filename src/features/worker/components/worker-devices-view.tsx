import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/atoms";
import { EmptyState } from "@/components/molecules/empty-state";
import type { MockDevice } from "@/mocks";

type WorkerDevicesViewProps = {
  devices: MockDevice[];
};

function shortDate(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

function deviceBadge(status: MockDevice["status"]) {
  if (status === "locked") return <Badge variant="locked">Locked</Badge>;
  if (status === "auto_solved") return <Badge variant="auto">Auto solved</Badge>;
  return <Badge variant="unlocked">Unlocked</Badge>;
}

export function WorkerDevicesView({ devices }: WorkerDevicesViewProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold tracking-tight">
          My devices
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Devices linked to your unlock work (mock)
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-xl">Unlocked / assigned</CardTitle>
          <CardDescription>
            {devices.length} device{devices.length === 1 ? "" : "s"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {devices.length === 0 ? (
            <EmptyState
              title="No devices yet"
              description="Unlocked phones you handle will appear here."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Device</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>IP</TableHead>
                  <TableHead>Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {devices.map((device) => (
                  <TableRow key={device.id}>
                    <TableCell>
                      <div className="font-medium">{device.model}</div>
                      <div className="font-mono text-xs text-muted-foreground">
                        {device.id}
                      </div>
                    </TableCell>
                    <TableCell>{deviceBadge(device.status)}</TableCell>
                    <TableCell>{device.location}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {device.ip}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {shortDate(device.updatedAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
