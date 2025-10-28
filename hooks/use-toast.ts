"use client"

import { useToastContext, type ToastPosition } from "@/components/toast-provider"

export function useToast() {
  const { addToast , toasts } = useToastContext()

  const toast = (
    title: string,
    options?: {
      description?: string
      position?: ToastPosition
      duration?: number
    },
  ) => {
    addToast({
      title,
      description: options?.description,
      position: options?.position || "top-right",
      duration: options?.duration,
    })
  }

  const success = (
    title: string,
    options?: {
      description?: string
      position?: ToastPosition
      duration?: number
    },
  ) => {
    toast(`✅ ${title}`, options)
  }

  const error = (
    title: string,
    options?: {
      description?: string
      position?: ToastPosition
      duration?: number
    },
  ) => {
    toast(`❌ ${title}`, options)
  }

  const warning = (
    title: string,
    options?: {
      description?: string
      position?: ToastPosition
      duration?: number
    },
  ) => {
    toast(`⚠️ ${title}`, options)
  }

  const info = (
    title: string,
    options?: {
      description?: string
      position?: ToastPosition
      duration?: number
    },
  ) => {
    toast(`ℹ️ ${title}`, options)
  }

  return {
    toast,
    success,
    error,
    warning,
    info,
    toasts
  }
}
