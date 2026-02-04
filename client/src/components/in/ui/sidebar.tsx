import React from "react";
import { Logo } from "../..";
import { useTheme } from "../../../context/theme-context";
import {
  SideItems,
  type ActionItem,
  type NavItem,
  type SideItem,
} from "../data";

import { Moon, Sun } from "lucide-react"; 

const Sidebar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  const isNavItem = (item: SideItem): item is NavItem => "path" in item;
  const isActionItem = (item: SideItem): item is ActionItem => "action" in item;

  const handleAction = (action: ActionItem["action"]) => {
    switch (action) {
      case "toggle-theme":
        toggleTheme();
        break;
      case "logout":
        console.log("Logging out...");
        break;
      default: {
        const _exhaustiveCheck: never = action;
        return _exhaustiveCheck;
      }
    }
  };

  const getThemeDisplay = () => {
    return {
      label: theme === "light" ? "Dark Mode" : "Light Mode",
      Icon: theme === "light" ? Moon : Sun,
    };
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
      <div className="mb-10">
        <Logo />
      </div>

      <nav>
        <ul className="space-y-1">
          {SideItems.map((item) => {
            const Icon = item.icon;
            const baseClasses =
              "flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150 w-full";

            if (isNavItem(item)) {
              return (
                <li key={item.name}>
                  <a href={item.path} className={baseClasses}>
                    <Icon />
                    <span className="font-medium text-sm">{item.name}</span>
                  </a>
                </li>
              );
            }

            if (isActionItem(item)) {
              let label = item.name;
              let DisplayIcon = Icon;

              if (item.action === "toggle-theme") {
                const themeDisplay = getThemeDisplay();
                label = themeDisplay.label;
                DisplayIcon = themeDisplay.Icon;
              }

              return (
                <li key={item.name}>
                  <button
                    type="button"
                    onClick={() => handleAction(item.action)}
                    className={baseClasses}
                  >
                    <DisplayIcon />
                    <span className="font-medium text-sm">{label}</span>
                  </button>
                </li>
              );
            }

            return null;
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
