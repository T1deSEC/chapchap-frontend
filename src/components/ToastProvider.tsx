import { createContext, useState, useCallback, ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

type ToastType = 'success' | 'error'
interface Toast { id: number; message: string; type: ToastType }

interface ToastContextValue {
  showSuccess: (message: string) => void
  showError: (message: string) => void
}

export const ToastContext = createContext<ToastContextValue>({
  showSuccess: () => {},
  showError: () => {},
})

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((message: string, type: ToastType) => {
    const id = Date.now()
    setToasts((prev) => [...prev.slice(-2), { id, message, type }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000)
  }, [])

  const showSuccess = useCallback((msg: string) => addToast(msg, 'success'), [addToast])
  const showError = useCallback((msg: string) => addToast(msg, 'error'), [addToast])

  return (
    <ToastContext.Provider value={{ showSuccess, showError }}>
      {children}
      <div className="fixed bottom-24 left-0 right-0 flex flex-col items-center gap-2 z-50 pointer-events-none px-4">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className={`px-5 py-3 rounded-xl text-white text-sm font-semibold shadow-lg ${
                t.type === 'success' ? 'bg-primary' : 'bg-red-500'
              }`}
            >
              {t.type === 'success' ? '✓ ' : '✕ '}{t.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}
