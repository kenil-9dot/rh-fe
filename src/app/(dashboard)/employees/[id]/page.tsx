"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  User,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { useEmployee } from "@/hooks/use-employees";

function formatDate(iso: string | null) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string | null | undefined;
}) {
  const v = value?.trim() || "—";
  return (
    <div className="flex items-center justify-between gap-4 py-3 first:pt-0">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
          <Icon className="h-4 w-4" />
        </div>
        <span className="text-sm text-gray-600">{label}</span>
      </div>
      <span className="text-right text-sm font-medium text-gray-900 wrap-break-word">
        {v}
      </span>
    </div>
  );
}

/** Rounded section box like reference image (Equipment / Contract cards) */
function SectionBox({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white p-6 sm:p-7 ${className}`}
    >
      <h3 className="font-poppins text-base font-semibold text-gray-900">
        {title}
      </h3>
      <div className="mt-5">{children}</div>
    </div>
  );
}

export default function EmployeeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? parseInt(params.id, 10) : null;

  const { data: employee, isLoading, error } = useEmployee(id);

  if (id == null || isNaN(id)) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center px-4">
        <p className="text-gray-500">Invalid employee ID.</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => router.push("/employees")}
        >
          Back to Employees
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="shrink-0 px-4 pt-4 pb-0 sm:px-6 sm:pt-6">
          <div className="h-6 w-48 animate-pulse rounded-lg bg-gray-200" />
          <div className="mt-4 h-8 w-64 animate-pulse rounded-lg bg-gray-100" />
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6">
          <div className="mx-auto max-w-4xl space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                <div className="h-20 w-20 shrink-0 animate-pulse rounded-full bg-gray-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-6 w-48 animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-64 animate-pulse rounded bg-gray-100" />
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-1">
                    <div className="h-3 w-16 animate-pulse rounded bg-gray-100" />
                    <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="h-64 animate-pulse rounded-2xl border border-gray-200 bg-white" />
              <div className="h-64 animate-pulse rounded-2xl border border-gray-200 bg-white" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="shrink-0 px-4 pt-4 sm:px-6 sm:pt-6">
          <Header
            title="Employee not found"
            description="The employee may have been removed or the link is invalid."
            breadcrumb={[
              { label: "Organisation", href: "/organisation" },
              { label: "Employees", href: "/employees" },
              { label: "Details" },
            ]}
          />
        </div>
        <div className="flex flex-1 items-center justify-center px-4">
          <div className="text-center">
            <p className="text-gray-500">
              {error?.message ?? "Employee not found."}
            </p>
            <Link href="/employees">
              <Button variant="outline" className="mt-4">
                Back to Employees
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const fullName =
    `${employee.firstName ?? ""} ${employee.lastName ?? ""}`.trim();
  const department = employee.department?.name ?? "—";
  const avatar =
    employee.photoUrl ||
    `https://i.pravatar.cc/200?img=${(employee.id % 70) + 1}`;
  const empCode = `EMP-${String(employee.id).padStart(4, "0")}`;
  const joinedDate = formatDate(employee.createdAt);
  const primaryEmail = employee.workEmail ?? employee.personalEmail ?? "—";
  const statusLabel = employee.isDeleted ? "Inactive" : "Active";

  const overviewItems = [
    { label: "Hired since", value: joinedDate },
    {
      label: "Department",
      value: department,
      icon: Briefcase,
    },
    { label: "Employee ID", value: empCode },
    { label: "Username", value: employee.user?.username ?? "—" },
    {
      label: "Status",
      value: statusLabel,
      dot: !employee.isDeleted,
    },
    { label: "Work email", value: employee.workEmail ?? "—" },
  ];

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0 px-4 pt-4 pb-0 sm:px-6 sm:pt-6">
        <Header
          title={fullName}
          description={department}
          breadcrumb={[
            { label: "Organisation", href: "/organisation" },
            { label: "Employees", href: "/employees" },
            { label: fullName },
          ]}
          actions={
            <Link href="/employees">
              <Button
                variant="secondary"
                size="sm"
                className="rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to list
              </Button>
            </Link>
          }
        />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full sm:h-24 sm:w-24">
                <Image
                  src={avatar}
                  alt={fullName}
                  fill
                  sizes="96px"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-poppins text-xl font-semibold text-gray-900 sm:text-2xl">
                  {fullName}
                </h2>
                <p className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                  <Mail className="h-4 w-4 shrink-0 text-indigo-500" />
                  {primaryEmail}
                </p>
              </div>
            </div>
          </div>

          <SectionBox title="Overview">
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
              {overviewItems.map((item) => (
                <div key={item.label} className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                    {item.label}
                  </p>
                  <p className="mt-1.5 flex items-center gap-1.5 text-sm font-semibold text-gray-900">
                    {"dot" in item && item.dot && (
                      <span
                        className="inline-block h-2 w-2 shrink-0 rounded-full bg-emerald-500"
                        aria-hidden
                      />
                    )}
                    {"dot" in item && !item.dot && (
                      <span
                        className="inline-block h-2 w-2 shrink-0 rounded-full bg-gray-400"
                        aria-hidden
                      />
                    )}
                    {"icon" in item && item.icon && (
                      <item.icon className="h-3.5 w-3.5 shrink-0 text-indigo-500" />
                    )}
                    <span className="truncate">{item.value}</span>
                  </p>
                </div>
              ))}
            </div>
          </SectionBox>

          <div className="grid gap-6 lg:grid-cols-2">
            <SectionBox title="Personal & Contact">
              <div className="divide-y divide-gray-100">
                <DetailRow
                  label="Personal email"
                  icon={Mail}
                  value={employee.personalEmail}
                />
                <DetailRow
                  label="Personal phone"
                  icon={Phone}
                  value={employee.personalPhone}
                />
                <DetailRow
                  label="Date of birth"
                  icon={Calendar}
                  value={employee.dob ? formatDate(employee.dob) : null}
                />
                <DetailRow
                  label="Address"
                  icon={MapPin}
                  value={employee.address}
                />
              </div>
            </SectionBox>

            <SectionBox title="Work details">
              <div className="divide-y divide-gray-100">
                <DetailRow
                  label="Department"
                  icon={Briefcase}
                  value={department}
                />
                <DetailRow
                  label="Work email"
                  icon={Mail}
                  value={employee.workEmail}
                />
                <DetailRow
                  label="Work phone"
                  icon={Phone}
                  value={employee.workPhone}
                />
                <DetailRow
                  label="Username"
                  icon={User}
                  value={employee.user?.username}
                />
              </div>
            </SectionBox>
          </div>
        </div>
      </div>
    </div>
  );
}
