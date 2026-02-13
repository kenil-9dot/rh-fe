"use client";

import { usePathname } from "next/navigation";

export default function Breadcrumb() {
  const pathname = usePathname();
  const paths = pathname.split("/").filter(Boolean);

  return (
    <div className="text-sm text-gray-500 flex gap-2">
      {paths.map((path, index) => (
        <span key={index} className="capitalize">
          {path}
          {index < paths.length - 1 && " / "}
        </span>
      ))}
    </div>
  );
}
