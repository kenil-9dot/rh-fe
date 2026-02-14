import {
  LayoutDashboard,
  Building2,
  Users,
  Shield,
  Layers,
  Network,
  Tags,
  Calendar,
  Clock,
  Wallet,
  User,
} from "lucide-react";

import { SidebarItem } from "@/types/sidebar";

export const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/",
  },
  {
    title: "Organisation",
    icon: Building2,
    children: [
      { title: "Employees", icon: Users, path: "/employees" },
      // { title: "Roles", icon: Shield, path: "/roles" },
      // { title: "Department", icon: Layers, path: "/department" },
      // { title: "Function", icon: Network, path: "/function" },
      // { title: "Employee Category", icon: Tags, path: "/employee-category" },
    ],
  },
  // {
  //   title: "Leave Management",
  //   icon: Calendar,
  //   path: "/leave",
  // },
  // {
  //   title: "Attendance",
  //   icon: Clock,
  //   path: "/attendance",
  // },
  // {
  //   title: "Payroll",
  //   icon: Wallet,
  //   path: "/payroll",
  // },
  // {
  //   title: "Profile",
  //   icon: User,
  //   path: "/profile",
  // },
];
