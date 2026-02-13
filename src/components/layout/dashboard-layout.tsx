'use client'
import { ReactNode, useState } from "react";
import Sidebar from "./Sidebar";
import { Menu } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar open={open} onClose={() => setOpen(false)} />

      <div className="flex flex-col flex-1">
        <div className="lg:hidden h-16 flex items-center px-4 border-b border-black/10 bg-white">
          <button
            type="button"
            className="rounded-md p-2 text-slate-700 hover:bg-black/5"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            <Menu size={18} />
          </button>
          <span className="ml-2 text-sm">Menu</span>
        </div>
        <main className="flex-1 flex flex-col overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
