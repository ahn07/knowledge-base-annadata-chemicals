"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

const ToastContext = createContext(null);
const TOAST_DURATION = 4200;

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function toastClasses(variant) {
  switch (variant) {
    case "success":
      return "border-emerald-200 bg-emerald-50 text-emerald-900";
    case "error":
      return "border-red-200 bg-red-50 text-red-900";
    case "loading":
      return "border-slate-200 bg-slate-50 text-slate-900";
    default:
      return "border-slate-200 bg-white text-slate-900";
  }
}

function ToastViewport({ toasts, dismiss }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex flex-col items-end gap-3 p-4 sm:items-end">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto w-full max-w-sm rounded-3xl border px-4 py-4 shadow-soft ${toastClasses(toast.variant)}`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 text-base">
                {toast.variant === "success" ? "✅" : toast.variant === "error" ? "⚠️" : "⏳"}
              </span>
              <div>
                <p className="font-semibold">{toast.title}</p>
                {toast.message ? <p className="mt-1 text-sm leading-6 text-current/80">{toast.message}</p> : null}
              </div>
            </div>
            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              className="text-sm font-semibold text-current/70 transition hover:text-current"
            >
              Close
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const addToast = useCallback(
    ({ title, message, variant = "default", duration = TOAST_DURATION, isLoading = false }) => {
      const id = createId();
      setToasts((current) => [...current, { id, title, message, variant, isLoading }]);

      if (!isLoading) {
        const timer = setTimeout(() => dismiss(id), duration);
        timers.current.set(id, timer);
      }

      return id;
    },
    [dismiss]
  );

  const updateToast = useCallback((id, update) => {
    setToasts((current) => current.map((toast) => (toast.id === id ? { ...toast, ...update } : toast)));
  }, []);

  const toast = useMemo(
    () => ({
      success: (message, title = "Success") => addToast({ title, message, variant: "success" }),
      error: (message, title = "Error") => addToast({ title, message, variant: "error" }),
      loading: (message, title = "Working") => addToast({ title, message, variant: "loading", isLoading: true, duration: 30000 }),
      dismiss,
      update: updateToast,
    }),
    [addToast, dismiss, updateToast]
  );

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastViewport toasts={toasts} dismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
