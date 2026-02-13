"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showMax = 7;

    if (totalPages <= showMax) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    // Always show first page
    pages.push(1);

    if (currentPage > 3) {
      pages.push("...");
    }

    // Show pages around current page
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    // Always show last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className={cn("flex flex-wrap items-center justify-between gap-2 sm:gap-4", className)}>
      <button
        onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="flex shrink-0 items-center gap-1 rounded-md px-2 py-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50 sm:px-0 sm:py-0"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Previous</span>
      </button>

      <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
        {pages.map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === "number" ? onPageChange?.(page) : undefined}
            disabled={typeof page !== "number"}
            className={cn(
              "flex h-8 min-w-8 cursor-pointer items-center justify-center rounded-md px-2 text-sm font-medium transition-colors sm:w-8",
              page === currentPage
                ? "bg-blue-500 text-white"
                : typeof page === "number"
                  ? "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                  : "cursor-default text-gray-400"
            )}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange?.(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="flex shrink-0 items-center gap-1 rounded-md px-2 py-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50 sm:px-0 sm:py-0"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
