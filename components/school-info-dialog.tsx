"use client"

import type React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Props {
  school: any;
  onClose: () => void;
  createdBy?: { name?: string; phone?: string };
  lastEditedBy?: { name?: string; phone?: string };
}

export default function SchoolInfoDialog({ school, onClose, createdBy, lastEditedBy }: Props) {
    if (!school) return null;
  return (
    <Dialog open={!!school} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>School Metadata</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-sm">
          <div>
            <strong>Created By:</strong>
            <p>Name: {school?.createdBy?.name  || "N/A"}</p>
            <p>Phone: {school?.createdBy?.phone || "N/A"}</p>
          </div>

          <div>
            <strong>Last Edited By:</strong>
            <p>Name: {school?.lastEditedBy?.name || "N/A"}</p>
            <p>Phone: {school?.lastEditedBy?.phone || "N/A"}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
