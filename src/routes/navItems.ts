import {
  LayoutDashboard,
  ClipboardList,
  Users,
  Gauge,
  CreditCard,
  FileBarChart,
  Settings,
  CalendarDays,
  CircleDollarSign,
  Truck,
  Wallet,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  {
    label: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },

  {
    label: "Shift Assignment",
    path: "/shift-assignment",
    icon: CalendarDays,
  },

  {
    label: "Daily Entry",
    path: "/daily-entry",
    icon: ClipboardList,
  },

  {
    label: "Payment Summary",
    path: "/payments",
    icon: CreditCard,
  },

  {
    label: "Cash Expenses",
    path: "/cash-expenses",
    icon: Wallet,
  },

  {
  label: "Customer Accounts",
  path: "/customer-accounts",
  icon: Users,
 },

  {
    label: "Shift Closing",
    path: "/shift-closing",
    icon: CircleDollarSign,
  },

  {
    label: "Fuel Receipt",
    path: "/receipts",
    icon: Truck,
  },

  {
    label: "Tank Management",
    path: "/tank-management",
    icon: Gauge,
  },

  {
    label: "Attendants",
    path: "/attendants",
    icon: Users,
  },

  {
    label: "Reports",
    path: "/reports",
    icon: FileBarChart,
  },

  {
    label: "Developer Tools",
    path: "/developer-tools",
    icon: Wrench,
  },

  {
    label: "Settings",
    path: "/settings",
    icon: Settings,
  },
];