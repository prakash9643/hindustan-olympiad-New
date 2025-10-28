"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { School } from "@/types/school";
import { regions, districts } from "@/utils/constants";

interface EditSchoolDialogProps {
  school: School;
  open: boolean;
  onClose: () => void;
  onSave: (school: School) => void;
}

export default function EditSchoolDialog({
  school,
  open,
  onClose,
  onSave,
}: EditSchoolDialogProps) {
  const [formData, setFormData] = useState(school);

  useEffect(() => {
    setFormData(school);
  }, [school]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData });
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit School</DialogTitle>
          <DialogDescription>Update the school information</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-schoolName">School Name</Label>
              <Input
                id="edit-schoolName"
                value={formData.schoolName}
                onChange={(e) =>
                  handleInputChange("schoolName", e.target.value)
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-branch">Branch</Label>
              <Input
                id="edit-branch"
                value={formData.branch}
                onChange={(e) => handleInputChange("branch", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-board">Board</Label>
              <Select
                value={formData.board}
                onValueChange={(value) => handleInputChange("board", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select board" />
                </SelectTrigger>
                <SelectContent>
                  {/* <SelectItem value="SSC">SSC</SelectItem> */}
                  <SelectItem value="State Board">State Board</SelectItem>
                  <SelectItem value="CBSE">CBSE</SelectItem>
                  <SelectItem value="ICSE">ICSE</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-principalName">Principal Name</Label>
              <Input
                id="edit-principalName"
                value={formData.principalName}
                onChange={(e) =>
                  handleInputChange("principalName", e.target.value)
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-principalPhone">Principal Phone</Label>
              <Input
                id="edit-principalPhone"
                value={formData.principalPhone}
                onChange={(e) =>
                  handleInputChange("principalPhone", e.target.value)
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-principalEmail">Principal Email</Label>
              <Input
                id="edit-principalEmail"
                type="email"
                value={formData.principalEmail}
                onChange={(e) =>
                  handleInputChange("principalEmail", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-coordinatorName">Coordinator Name</Label>
              <Input
                id="edit-coordinatorName"
                value={formData.coordinatorName}
                onChange={(e) =>
                  handleInputChange("coordinatorName", e.target.value)
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-coordinatorPhone">Coordinator Phone</Label>
              <Input
                id="edit-coordinatorPhone"
                value={formData.coordinatorPhone}
                onChange={(e) =>
                  handleInputChange("coordinatorPhone", e.target.value)
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-coordinatorEmail">Coordinator Email</Label>
              <Input
                id="edit-coordinatorEmail"
                type="email"
                value={formData.coordinatorEmail}
                onChange={(e) =>
                  handleInputChange("coordinatorEmail", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pincode">Pincode</Label>
              <Input
                id="pincode"
                value={formData.pincode}
                onChange={(e) => handleInputChange("pincode", e.target.value)}
                
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
