import { ReactNode } from "react";
import { Breadcrumb } from "@/components/ui/breadcrumb";

type HeaderProps = {
  title: string;
  description: string;
  breadcrumb: { label: string; href?: string }[];
  actions?: ReactNode;
};

export function Header({ title, description, breadcrumb, actions }: HeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      <Breadcrumb items={breadcrumb} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-xl font-semibold tracking-tight sm:text-2xl">
            {title}
          </h1>
          <p className="mt-0.5 line-clamp-2 text-sm text-gray-500 sm:line-clamp-none">
            {description}
          </p>
        </div>

        {actions && (
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
