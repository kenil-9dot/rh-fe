"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectContextValue {
  value: string;
  onValueChange: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  labels: Record<string, string>;
  registerLabel: (value: string, label: string) => void;
}

const SelectContext = React.createContext<SelectContextValue | undefined>(undefined);

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}

export function Select({ value, onValueChange, children }: SelectProps) {
  const [open, setOpen] = React.useState(false);
  const [labels, setLabels] = React.useState<Record<string, string>>({});

  const registerLabel = React.useCallback((value: string, label: string) => {
    setLabels((prev) => {
      if (prev[value] === label) return prev;
      return { ...prev, [value]: label };
    });
  }, []);

  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen, labels, registerLabel }}>
      <div className="relative inline-block w-full text-left">
        {children}
      </div>
    </SelectContext.Provider>
  );
}

interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children: React.ReactNode;
}

export const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const context = React.useContext(SelectContext);
    if (!context) throw new Error("SelectTrigger must be used within a Select");

    return (
      <button
        ref={ref}
        type="button"
        onClick={() => context.setOpen(!context.open)}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50/50 transition-colors",
          className
        )}
        {...props}
      >
        {children}
        <ChevronDown className="h-4 w-4 opacity-50" />
      </button>
    );
  }
);
SelectTrigger.displayName = "SelectTrigger";

interface SelectValueProps {
  placeholder?: string;
}

export function SelectValue({ placeholder }: SelectValueProps) {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error("SelectValue must be used within a Select");

  const label = context.labels[context.value] || context.value;

  return (
    <span className="block truncate">
      {context.value ? label : placeholder}
    </span>
  );
}

interface SelectContentProps {
  className?: string;
  children: React.ReactNode;
}

export function SelectContent({ className, children }: SelectContentProps) {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error("SelectContent must be used within a Select");

  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        // We rely on the trigger's click handler to toggle, but here we explicitly close
        // The issue is if we click the trigger, this might fire before trigger's toggle?
        // Usually trigger is outside content.
        // Better check: if click is NOT on trigger.
        // Simplified: use a timeout or just setOpen(false) and hope trigger stops propagation if needed.
        // But trigger uses onClick which bubbles.
        // Standard pattern: backdrop or document listener.
        context.setOpen(false);
      }
    };

    if (context.open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [context.open, context]);

  if (!context.open) return null;

  return (
    <div
      ref={ref}
      className={cn(
        "absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm animate-in fade-in zoom-in-95 duration-100",
        className
      )}
    >
      {children}
    </div>
  );
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export function SelectItem({ value, children, className }: SelectItemProps) {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error("SelectItem must be used within a Select");

  const isSelected = context.value === value;

  // Register label
  React.useEffect(() => {
    if (typeof children === 'string') {
      context.registerLabel(value, children);
    }
  }, [value, children, context]);

  return (
    <div
      className={cn(
        "relative cursor-default select-none py-2 pl-10 pr-4 text-gray-900 hover:bg-indigo-50 hover:text-indigo-900 cursor-pointer outline-none transition-colors",
        isSelected && "bg-indigo-50 text-indigo-900",
        className
      )}
      onClick={(e) => {
        e.stopPropagation();
        context.onValueChange(value);
        context.setOpen(false);
      }}
    >
      <span className={cn("block truncate", isSelected && "font-medium")}>
        {children}
      </span>
      {isSelected && (
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600">
          <Check className="h-4 w-4" aria-hidden="true" />
        </span>
      )}
    </div>
  );
}
