"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { Toast as ToastType } from "./toast-provider"

interface ToastProps {
  toast: ToastType
  onClose: () => void
}

export function Toast({ toast, onClose }: ToastProps) {
  return (
    <Card className="w-80 p-4 shadow-lg border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-start gap-3">
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold leading-none tracking-tight">{toast.title}</h4>
          </div>
          {toast.description && <p className="text-sm text-muted-foreground">{toast.description}</p>}
        </div>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-muted" onClick={onClose}>
          <X className="h-3 w-3" />
          <span className="sr-only">Close</span>
        </Button>
      </div>
      <div className="mt-3 flex justify-end">
        <Button size="sm" onClick={onClose} className="h-7 px-3 text-xs">
          OK
        </Button>
      </div>
    </Card>
  )
}
