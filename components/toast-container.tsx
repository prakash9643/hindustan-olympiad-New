"use client"

import { Toast } from "./toast"
import { useToastContext, type ToastPosition } from "./toast-provider"

const positionClasses: Record<ToastPosition, string> = {
  "top-left": "top-4 left-4",
  "top-right": "top-4 left-1/2 -translate-x-1/2",
  "top-center": "top-4 left-1/2 -translate-x-1/2",
  "bottom-left": "bottom-4 left-4",
  "bottom-right": "bottom-4 right-4",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
}

export function ToastContainer() {
  const { toasts, removeToast } = useToastContext()

  // Group toasts by position
  const toastsByPosition = toasts.reduce(
    (acc, toast) => {
      if (!acc[toast.position]) {
        acc[toast.position] = []
      }
      acc[toast.position].push(toast)
      return acc
    },
    {} as Record<ToastPosition, typeof toasts>,
  )

  return (
    <>
      {Object.entries(toastsByPosition).map(([position, positionToasts]) => (
        <div key={position} className={`fixed z-50 flex flex-col gap-2 ${positionClasses[position as ToastPosition]}`}>
          {positionToasts.map((toast, index) => (
            <div
              key={toast.id}
              className="animate-in slide-in-from-top-full duration-300"
              style={{
                animationDelay: `${index * 100}ms`,
                transform: `translateY(${index * 4}px)`,
                zIndex: 50 - index,
              }}
            >
              <Toast toast={toast} onClose={() => removeToast(toast.id)} />
            </div>
          ))}
        </div>
      ))}
    </>
  )
}
