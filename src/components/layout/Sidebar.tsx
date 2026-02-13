"use client";

import { useState } from "react";
import { SIDEBAR_ITEMS } from "@/config/sidebar";
import SidebarItem from "./sidebarItem";
import { X, LogOut } from "lucide-react";
import { removeSession } from "@/actions/session";
import { ConfirmDialog } from "@/components/ui/dialog";

export default function Sidebar({
  open = false,
  onClose,
}: {
  open?: boolean;
  onClose?: () => void;
}) {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogoutClick = () => setShowLogoutConfirm(true);

  const handleLogoutConfirm = async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
    }
    await removeSession();
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity lg:hidden ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden={!open}
      />
      <aside
        className={`fixed z-50 lg:z-0 lg:static left-0 top-0 h-full lg:h-screen w-72 bg-gradient-to-b from-[#0B0B16] via-[#0E0E1A] to-[#0B0B16] text-slate-300 flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
        aria-label="Sidebar"
      >
      {/* Logo */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-white/5">
        <div className="h-9 w-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
          E
        </div>
        <span className="text-lg font-semibold text-white">EyHR</span>
        <button
          type="button"
          className="ml-auto lg:hidden rounded-md p-2 text-slate-300 hover:bg-white/10"
          aria-label="Close menu"
          aria-expanded={open}
          onClick={onClose}
        >
          <X size={16} />
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {SIDEBAR_ITEMS.map((item) => (
          <SidebarItem key={item.title} item={item} />
        ))}
      </nav>

      {/* Profile */}
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20 shrink-0">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Admin User</p>
            <p className="text-xs text-slate-400 truncate">admin@example.com</p>
          </div>
          <button
            onClick={handleLogoutClick}
            className="shrink-0 flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors cursor-pointer"
            title="Sign out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
      </aside>

      <ConfirmDialog
        open={showLogoutConfirm}
        onOpenChange={setShowLogoutConfirm}
        title="Sign out"
        description="Are you sure you want to sign out? You will need to sign in again to access your account."
        confirmLabel="Sign out"
        cancelLabel="Cancel"
        onConfirm={handleLogoutConfirm}
        confirmVariant="destructive"
        size="sm"
        variant="dark"
        closeOnOverlayClick={false}
        showCloseButton={false}
      />
    </>
  );
}

