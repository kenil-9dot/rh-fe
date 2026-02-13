"use client";

import { SidebarItem as ItemType } from "@/types/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

export default function SidebarItem({ item }: { item: ItemType }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const Icon = item.icon;
  const isActive = item.path === pathname;

  // Auto-expand if any child matches current path
  useEffect(() => {
    if (item.children && item.children.some((c) => c.path === pathname)) {
      setOpen(true);
    }
  }, [item.children, pathname]);

  /* Parent with children */
  if (item.children) {
    return (
      <div>
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg hover:bg-white/5 transition font-poppins"
          aria-expanded={open}
        >
          <span className="flex items-center gap-3">
            <Icon size={18} />
            <span className="text-sm font-poppins">{item.title}</span>
          </span>
          <ChevronDown
            size={16}
            className={`transition ${open ? "rotate-180" : ""}`}
          />
        </button>

        <div
          className={`mt-1 ml-6 space-y-1 overflow-hidden transition-all duration-300 ${
            open ? "max-h-96" : "max-h-0"
          }`}
        >
          {item.children.map((child) => {
            const ChildIcon = child.icon;
            const active = pathname === child.path;

            return (
              <Link
                key={child.title}
                href={child.path!}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition font-poppins
                  ${
                    active
                      ? "bg-blue-600/15 text-white"
                      : "text-slate-400 hover:bg-white/5"
                  }
                `}
              >
                <ChildIcon size={16} />
                <span className="font-poppins">{child.title}</span>
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  /* Single item */
  return (
    <Link
      href={item.path!}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition font-poppins
        ${
          isActive
            ? "bg-blue-600/20 text-white"
            : "hover:bg-white/5"
        }
      `}
    >
      <Icon size={18} />
      <span className="font-poppins">{item.title}</span>
    </Link>
  );
}

