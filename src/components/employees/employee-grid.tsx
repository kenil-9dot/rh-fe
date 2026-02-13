import { EmployeeCard } from "./employee-card";
import type { Employee } from "@/types/employee";

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function mapEmployeeToCard(emp: Employee, index: number) {
  const fullName = `${emp.firstName ?? ""} ${emp.lastName ?? ""}`.trim();
  const name = fullName || "—";
  const role = emp.department?.name ?? "—";
  const avatar =
    emp.photoUrl ||
    `https://i.pravatar.cc/150?img=${(index % 70) + 1}`;
  const empCode = `EMP-${String(emp.id).padStart(4, "0")}`;
  const joiningDate = formatDate(emp.createdAt);
  return {
    name,
    role,
    avatar,
    empCode,
    joiningDate,
    tags: role !== "—" ? [role] : [],
  };
}

interface EmployeeGridProps {
  employees: Employee[];
  isLoading?: boolean;
  error?: string | null;
}

export function EmployeeGrid({
  employees,
  isLoading = false,
  error = null,
}: EmployeeGridProps) {
  if (error) {
    return (
      <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-center text-sm text-red-700 sm:p-6">
        {error}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-52 animate-pulse rounded-2xl bg-gray-100 sm:h-64"
            aria-hidden
          />
        ))}
      </div>
    );
  }

  if (!employees.length) {
    return (
      <div className="rounded-xl border border-gray-100 bg-gray-50 p-8 text-center text-sm text-gray-500 sm:p-12">
        No employees found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
      {employees.map((emp, index) => (
        <EmployeeCard key={emp.id ?? index} {...mapEmployeeToCard(emp, index)} />
      ))}
    </div>
  );
}
