"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useCreateEmployee } from "@/hooks/use-employees";
import type { CreateEmployeePayload } from "@/types/employee";

const GENDER_OPTIONS = [
  { value: "0", label: "Other" },
  { value: "1", label: "Male" },
  { value: "2", label: "Female" },
] as const;

const MARITAL_OPTIONS = [
  { value: "1", label: "Single" },
  { value: "2", label: "Married" },
  { value: "3", label: "Other" },
] as const;

const STATUS_OPTIONS = [
  { value: "0", label: "Inactive" },
  { value: "1", label: "Active" },
] as const;

const initialForm: CreateEmployeePayload = {
  firstName: "",
  lastName: "",
  userId: 0,
  departmentId: 0,
  address: "",
  photoUrl: null,
  gender: 1,
  dob: null,
  maritalStatus: 1,
  idPhotoUrl: null,
  personalPhone: null,
  workPhone: null,
  personalEmail: null,
  workEmail: null,
  status: 1,
};

export interface CreateEmployeeFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreateEmployeeForm({ onSuccess, onCancel }: CreateEmployeeFormProps) {
  const [form, setForm] = useState<CreateEmployeePayload>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof CreateEmployeePayload, string>>>({});

  const createEmployee = useCreateEmployee({
    onSuccess: () => {
      setForm(initialForm);
      setErrors({});
      onSuccess?.();
    },
  });

  const update = (key: keyof CreateEmployeePayload, value: string | number | null) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const getLoggedInUserId = (): number | null => {
    if (typeof window === "undefined") return null;
    const id = window.localStorage.getItem("user_id");
    if (!id) return null;
    const num = parseInt(id, 10);
    return Number.isNaN(num) ? null : num;
  };

  const validate = (): boolean => {
    const next: typeof errors = {};
    if (!form.firstName?.trim()) next.firstName = "First name is required";
    if (!form.lastName?.trim()) next.lastName = "Last name is required";
    if (!form.address?.trim()) next.address = "Address is required";
    const userId = getLoggedInUserId();
    if (userId === null || userId < 1) next.userId = "You must be logged in to create an employee.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const userId = getLoggedInUserId();
    if (userId === null || userId < 1) return;
    createEmployee.mutate({
      ...form,
      userId,
      departmentId: form.departmentId || 1,
      photoUrl: form.photoUrl || null,
      dob: form.dob || null,
      idPhotoUrl: form.idPhotoUrl || null,
      personalPhone: form.personalPhone || null,
      workPhone: form.workPhone || null,
      personalEmail: form.personalEmail || null,
      workEmail: form.workEmail || null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            First name <span className="text-red-500">*</span>
          </label>
          <Input
            value={form.firstName}
            onChange={(e) => update("firstName", e.target.value)}
            placeholder="First name"
            className={errors.firstName ? "border-red-500" : ""}
          />
          {errors.firstName && (
            <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>
          )}
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Last name <span className="text-red-500">*</span>
          </label>
          <Input
            value={form.lastName}
            onChange={(e) => update("lastName", e.target.value)}
            placeholder="Last name"
            className={errors.lastName ? "border-red-500" : ""}
          />
          {errors.lastName && (
            <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>
          )}
        </div>
      </div>

      {errors.userId && (
        <p className="text-xs text-red-500">{errors.userId}</p>
      )}

      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Address <span className="text-red-500">*</span>
        </label>
        <Input
          value={form.address}
          onChange={(e) => update("address", e.target.value)}
          placeholder="Full address"
          className={errors.address ? "border-red-500" : ""}
        />
        {errors.address && (
          <p className="mt-1 text-xs text-red-500">{errors.address}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Personal email
          </label>
          <Input
            type="email"
            value={form.personalEmail ?? ""}
            onChange={(e) => update("personalEmail", e.target.value || null)}
            placeholder="personal@example.com"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Work email
          </label>
          <Input
            type="email"
            value={form.workEmail ?? ""}
            onChange={(e) => update("workEmail", e.target.value || null)}
            placeholder="work@company.com"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Personal phone
          </label>
          <Input
            type="tel"
            value={form.personalPhone ?? ""}
            onChange={(e) => update("personalPhone", e.target.value || null)}
            placeholder="+1 234 567 8900"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Work phone
          </label>
          <Input
            type="tel"
            value={form.workPhone ?? ""}
            onChange={(e) => update("workPhone", e.target.value || null)}
            placeholder="+1 234 567 8901"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Date of birth
          </label>
          <Input
            type="date"
            value={form.dob ?? ""}
            onChange={(e) => update("dob", e.target.value || null)}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Gender
          </label>
          <Select
            value={String(form.gender ?? 1)}
            onValueChange={(v) => update("gender", Number(v))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              {GENDER_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Marital status
          </label>
          <Select
            value={String(form.maritalStatus ?? 1)}
            onValueChange={(v) => update("maritalStatus", Number(v))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {MARITAL_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Employee status
          </label>
          <Select
            value={String(form.status ?? 1)}
            onValueChange={(v) => update("status", Number(v))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {createEmployee.isError && (
        <p className="text-sm text-red-500">
          {createEmployee.error?.message ?? "Failed to create employee"}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-end gap-2 border-t border-gray-100 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={createEmployee.isPending}>
          {createEmployee.isPending ? "Creating…" : "Create employee"}
        </Button>
      </div>
    </form>
  );
}
