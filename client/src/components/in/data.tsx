import {
  CircleQuestionMark,
  FileText,
  LayoutGrid,
  LogOut,
  Moon,
  Settings,
  Share2,
  Users
} from "lucide-react";

const handleThemeSwitch = () => {
  console.log("Theme toggled");
};

export const SideItems = [
  {
    icon: LayoutGrid,
    name: "Home",
    path: "/in/home",
  },
  {
    icon: FileText,
    name: "All Files",
    path: "/in/files",
  },
  {
    icon: Share2,
    name: "Shared by You",
    path: "/in/shared-by-you",
  },
  {
    icon: Users,
    name: "Shared with You",
    path: "/in/shared-with-you",
  },
  {
    icon: Settings,
    name: "Settings",
    path: "/in/settings",
  },
  {
    icon: CircleQuestionMark,
    name: "Support Center",
    path: "/in/support",
  },
  {
    icon: LogOut,
    name: "Log Out",
    path: "/in/logout",
  },
  {
    icon: Moon,
    name: "Dark Mode",
    action: handleThemeSwitch,
  },
];

export const convertibles = [
  { base: "DOC", quote: "PDF" },
  { base: "XLSX", quote: "PDF" },
  { base: "JPG", quote: "PDF" },
  { base: "PDF", quote: "JPG" },
];
