import {
  CircleQuestionMark,
  FileText,
  LayoutGrid,
  LogOut,
  Moon,
  Settings,
  Share2,
  Users,
} from "lucide-react";
export type NavItem = {
  icon: React.ComponentType;
  name: string;
  path: string;
};

export type ActionItem = {
  icon: React.ComponentType;
  name: string;
  action: "toggle-theme" | "logout";
};

export type SideItem = NavItem | ActionItem;

export const SideItems: SideItem[] = [
  {
    icon: LayoutGrid,
    name: "Home",
    path: "/in/home",
  },
  {
    icon: FileText,
    name: "All Files",
    path: "/in/home",
  },
  {
    icon: Share2,
    name: "Shared by You",
    path: "/in/home",
  },
  {
    icon: Users,
    name: "Shared with You",
    path: "/in/home",
  },
  {
    icon: Settings,
    name: "Settings",
    path: "/in/home",
  },
  {
    icon: CircleQuestionMark,
    name: "Support Center",
    path: "/in/home",
  },
  {
    icon: LogOut,
    name: "Log Out",
    action: "logout",
  },
  {
    icon: Moon,
    name: "Dark Mode",
    action: "toggle-theme", 
  },
];


export const convertibles = [
  { base: "DOC", quote: "PDF" },
  { base: "DOCX", quote: "PDF" },
  { base: "XLSX", quote: "PDF" },
  { base: "JPG", quote: "PDF" },
  { base: "PDF", quote: "DOC" },
  { base: "PDF", quote: "DOCX" },
];
