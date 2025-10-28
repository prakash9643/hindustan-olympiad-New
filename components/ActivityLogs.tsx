"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ActivityLogDialogProps {
  open: boolean;
  onClose: () => void;
  logs: string[];
}

export default function ActivityLogDialog({
  open,
  onClose,
  logs,
}: ActivityLogDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Activity Logs</DialogTitle>
          <DialogDescription>
            Recent system or user activities.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-64 overflow-y-auto space-y-2 mt-4 text-sm text-muted-foreground">
          {logs.length > 0 ? (
            logs.map((log, index) => (
              <div key={index} className="border-b pb-2 last:border-none">
                {log}
              </div>
            ))
          ) : (
            <p>No activity logs available.</p>
          )}
        </div>
        <div className="mt-6 text-right">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
