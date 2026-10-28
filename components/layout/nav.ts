import { House, Plus, Wallet } from "lucide-react";

export const navItems = [
  { href: "/dashboard", label: "หน้าหลัก", icon: House },
  { href: "/payments", label: "การชำระ", icon: Wallet },
  { href: "/jobs/new", label: "เพิ่มงาน", icon: Plus },
];

export const isActive = (path: string, href: string) => path === href || path.startsWith(href + "/");
