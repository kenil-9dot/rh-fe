import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "soft";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default:
      "border-transparent bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm",
    secondary:
      "border-transparent bg-gray-100 text-gray-900 hover:bg-gray-200",
    destructive:
      "border-transparent bg-red-500 text-white hover:bg-red-600 shadow-sm",
    outline: "text-gray-900 border border-gray-200",
    soft: "border-transparent bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-700/10 hover:bg-blue-100",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
