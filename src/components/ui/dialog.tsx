"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type DialogSize = "sm" | "md" | "lg" | "xl" | "full";

export type DialogVariant = "default" | "dark";

export interface DialogProps {
  /** Whether the dialog is open */
  open: boolean;
  /** Called when open state should change (close requested or after close) */
  onOpenChange: (open: boolean) => void;
  /** Dialog title (optional) */
  title?: React.ReactNode;
  /** Optional title id for aria-labelledby */
  titleId?: string;
  /** Short description or body text (ignored if children are provided) */
  description?: React.ReactNode;
  /** Custom body content (overrides description when provided) */
  children?: React.ReactNode;
  /** Footer content (e.g. action buttons) */
  footer?: React.ReactNode;
  /** Show X close button in header */
  showCloseButton?: boolean;
  /** Close when clicking the overlay */
  closeOnOverlayClick?: boolean;
  /** Close when pressing Escape */
  closeOnEscape?: boolean;
  /** Max width / size of the content panel */
  size?: DialogSize;
  /** Visual variant */
  variant?: DialogVariant;
  /** Class name for the overlay */
  overlayClassName?: string;
  /** Class name for the content panel (card) */
  contentClassName?: string;
  /** Class name for the inner content wrapper (below header) */
  bodyClassName?: string;
  /** Accessibility: role (default "dialog") */
  role?: "dialog" | "alertdialog";
}

const sizeClasses: Record<DialogSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "max-w-[calc(100vw-2rem)] w-full",
};

const variantContentClasses: Record<DialogVariant, string> = {
  default: "bg-white text-gray-900 border-gray-200 shadow-xl",
  dark: "bg-[#0E0E1A] text-slate-100 border-white/10 shadow-xl",
};

const variantTitleClasses: Record<DialogVariant, string> = {
  default: "text-gray-900",
  dark: "text-white",
};

const variantBodyClasses: Record<DialogVariant, string> = {
  default: "text-gray-600",
  dark: "text-slate-400",
};

export function Dialog({
  open,
  onOpenChange,
  title,
  titleId: titleIdProp,
  description,
  children,
  footer,
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  size = "md",
  variant = "default",
  overlayClassName,
  contentClassName,
  bodyClassName,
  role = "dialog",
}: DialogProps) {
  const titleId = titleIdProp ?? (title && typeof title === "string" ? "dialog-title" : undefined);
  const generatedTitleId = React.useId();
  const resolvedTitleId = titleId ?? generatedTitleId;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onOpenChange(false);
    }
  };

  const handleClose = () => onOpenChange(false);

  React.useEffect(() => {
    if (!open || !closeOnEscape) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, closeOnEscape, onOpenChange]);

  React.useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  if (!open) return null;

  const content = (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center p-4",
        variant === "dark" ? "bg-black/60" : "bg-black/50",
        overlayClassName
      )}
      onClick={handleOverlayClick}
      aria-modal="true"
      role={role}
      aria-labelledby={title ? resolvedTitleId : undefined}
    >
      <div
        className={cn(
          "w-full rounded-xl border p-6",
          sizeClasses[size],
          variantContentClasses[variant],
          contentClassName
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || showCloseButton) && (
          <div className="flex items-start justify-between gap-4">
            {title && (
              <h2
                id={resolvedTitleId}
                className={cn(
                  "text-lg font-semibold leading-tight",
                  variantTitleClasses[variant]
                )}
              >
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                type="button"
                onClick={handleClose}
                className={cn(
                  "shrink-0 rounded-md p-1.5 transition-colors -mt-1 -mr-1",
                  variant === "default"
                    ? "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                    : "text-slate-400 hover:bg-white/10 hover:text-white"
                )}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            )}
          </div>
        )}

        <div
          className={cn(
            title || showCloseButton ? "mt-4" : "",
            footer ? "mb-6" : "",
            variantBodyClasses[variant],
            "text-sm",
            bodyClassName
          )}
        >
          {children !== undefined && children !== null ? (
            children
          ) : description ? (
            <p className="leading-relaxed">{description}</p>
          ) : null}
        </div>

        {footer && (
          <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  if (typeof document !== "undefined") {
    return createPortal(content, document.body);
  }
  return content;
}

/** Convenience: Dialog with fixed footer layout (cancel + primary action) */
export interface ConfirmDialogProps extends Omit<DialogProps, "footer" | "children"> {
  /** Primary action label (e.g. "Delete", "Sign out") */
  confirmLabel: React.ReactNode;
  /** Cancel button label */
  cancelLabel?: React.ReactNode;
  /** Called when confirm is clicked; dialog closes after this if it doesn’t throw */
  onConfirm: () => void | Promise<void>;
  /** Variant for the confirm button */
  confirmVariant?: "default" | "destructive";
  /** Show loading state on confirm button */
  confirmLoading?: boolean;
}

export function ConfirmDialog({
  confirmLabel,
  cancelLabel = "Cancel",
  onConfirm,
  confirmVariant = "default",
  confirmLoading = false,
  closeOnOverlayClick = false,
  showCloseButton = false,
  ...rest
}: ConfirmDialogProps) {
  const [loading, setLoading] = React.useState(false);
  const isPending = loading || confirmLoading;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
      rest.onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      {...rest}
      closeOnOverlayClick={closeOnOverlayClick}
      showCloseButton={showCloseButton}
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => rest.onOpenChange(false)}
            disabled={isPending}
            className={
              rest.variant === "dark"
                ? "border-white/20 bg-white/5 text-slate-300 hover:bg-white/10"
                : undefined
            }
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            size="sm"
            variant={confirmVariant === "destructive" ? "destructive" : "default"}
            onClick={handleConfirm}
            disabled={isPending}
            isLoading={isPending}
            className={
              confirmVariant === "destructive"
                ? "bg-red-600 text-white hover:bg-red-700"
                : undefined
            }
          >
            {confirmLabel}
          </Button>
        </>
      }
    />
  );
}
