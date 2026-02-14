"use client";

import { useState, useCallback } from "react";
import { PageActions } from "@/components/common/page-actions";
import { SearchInput } from "@/components/common/search-input";
import { EmployeeFilters } from "@/components/employees/employee-filters";
import { EmployeeGrid } from "@/components/employees/employee-grid";
import { Header } from "@/components/layout/Header";
import { Pagination } from "@/components/common/pagination";
import { Button } from "@/components/ui/button";
import { CloudDownload, Plus } from "lucide-react";
import { useEmployees } from "@/hooks/use-employees";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useIsXlScreen } from "@/hooks/use-breakpoint";

const ITEMS_PER_PAGE_LG = 18; // lg and below
const ITEMS_PER_PAGE_XL = 20; // xl and above
const SEARCH_DEBOUNCE_MS = 400;

export default function EmployeesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const isXl = useIsXlScreen();

  const itemsPerPage = isXl ? ITEMS_PER_PAGE_XL : ITEMS_PER_PAGE_LG;

  const debouncedSearch = useDebouncedValue(search, SEARCH_DEBOUNCE_MS);

  const { data, isLoading, error } = useEmployees({
    page: currentPage,
    limit: itemsPerPage,
    sortBy: "createdAt",
    sortOrder: "desc",
    search: debouncedSearch.trim() || undefined,
  });

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setCurrentPage(1);
  }, []);

  const employees = data?.data ?? [];
  const total = data?.total ?? 0;
  const limitFromApi = data?.limit ?? itemsPerPage;
  const totalPages = Math.max(1, Math.ceil(total / limitFromApi));

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const contentArea = document.getElementById("employee-content-area");
    if (contentArea) {
      contentArea.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* First Part: Header */}
      <div className="shrink-0 px-4 pt-4 pb-0 sm:px-6 sm:pt-6">
        <Header
          title={`Employees (${total})`}
          description="All the employees in your organisation are listed here."
          breadcrumb={[
            { label: "Organisation", href: "/organisation" },
            { label: "Employees" },
          ]}
          actions={
            <div className="flex w-full flex-col-reverse gap-2 sm:w-auto sm:flex-row sm:flex-wrap">
              <Button
                variant="outline"
                size="sm"
                className="w-full border-gray-200 bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900 sm:w-auto sm:shrink-0"
              >
                <CloudDownload className="mr-2 h-4 w-4 shrink-0" />
                <span className="truncate">Import Employees</span>
              </Button>
              <Button size="sm" className="w-full bg-blue-500 hover:bg-blue-600 sm:w-auto sm:shrink-0">
                <Plus className="mr-2 h-4 w-4 shrink-0" />
                <span className="truncate">Add New Employee</span>
              </Button>
            </div>
          }
        />
      </div>

      {/* Second Part: Content (Scrollable) */}
      <div
        id="employee-content-area"
        className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-4 py-4 sm:px-6 sm:py-6"
      >
        <div className="space-y-4 sm:space-y-6">
          <PageActions>
            <SearchInput
              placeholder="Search employees..."
              value={search}
              onChange={handleSearchChange}
            />
            <EmployeeFilters />
          </PageActions>

          <EmployeeGrid
            employees={employees}
            isLoading={isLoading}
            error={error ? error.message : null}
          />
        </div>
      </div>

      {/* Third Part: Pagination Footer */}
      <div className="shrink-0 border-t border-gray-100 bg-white px-4 py-3 sm:px-6 sm:py-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
