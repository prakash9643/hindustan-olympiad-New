"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"
import { useRouter } from "next/navigation"

export type ToastPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right" | "top-center" | "bottom-center"

export interface Toast {
  id: string
  title: string
  description?: string
  position: ToastPosition
  duration?: number
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, "id">) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast = { ...toast, id }

    setToasts((prev) => [...prev, newToast])

    // Auto remove toast after duration (default 5 seconds)
    const duration = 50000
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
  }, [router])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [router])

  return <ToastContext.Provider value={{ toasts, addToast, removeToast }}>{children}</ToastContext.Provider>
}

export function useToastContext() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error("useToastContext must be used within a ToastProvider")
  }
  return context
}
