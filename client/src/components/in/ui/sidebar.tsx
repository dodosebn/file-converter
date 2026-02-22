import React from "react";
import { Logo } from "../..";
import { useTheme } from "../../../context/theme-context";
import {
  SideItems,
  type ActionItem,
  type NavItem,
  type SideItem,
} from "../data";
import { Moon, Sun, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/authContext";

type SidebarProps = {
  mobile?: boolean;
  open?: boolean;
  onClose?: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({
  mobile = false,
  open = false,
  onClose,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const isNavItem = (item: SideItem): item is NavItem => "path" in item;
  const isActionItem = (item: SideItem): item is ActionItem =>
    "action" in item;

  const handleAction = (action: ActionItem["action"]) => {
    switch (action) {
      case "toggle-theme":
        toggleTheme();
        break;

      case "logout":
        logout();
        navigate("/login");
        break;

      default: {
        const _exhaustiveCheck: never = action;
        return _exhaustiveCheck;
      }
    }
  };

  const themeLabel = theme === "light" ? "Dark Mode" : "Light Mode";
  const ThemeIcon = theme === "light" ? Moon : Sun;

  if (mobile) {
    return (
      <div
        className={`fixed inset-0 z-50 md:hidden ${
          open ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div
          className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
          onClick={onClose}
        />

        <aside
          className={`absolute left-0 top-0 h-full w-72 bg-white p-6
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}`}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-lg p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>

          {renderSidebarContent()}
        </aside>
      </div>
    );
  }

  return (
    <aside className="bg-white dark:bg-[#141f38] rounded-xl p-6  shadow-sm w-72">
      {renderSidebarContent()}
    </aside>
  );

  function renderSidebarContent() {
    return (
      <>
        <div className="mb-10">
          <Logo />
        </div>

        <nav>
          <ul className="space-y-1">
            {SideItems.map((item) => {
              const Icon = item.icon;
              const baseClasses =
                "flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 dark:hover:bg-[#1d283a]  hover:bg-gray-50 hover:text-gray-900 transition w-full";

              if (isNavItem(item)) {
                return (
                  <li key={item.name}>
                    <a href={item.path} className={`${baseClasses} dark:text-gray-400 dark:hover:text-[#f8fafc]`}>
                     <Icon />
                      <span className="font-medium text-sm ">
                        {item.name}
                      </span>
                    </a>
                  </li>
                );
              }

              if (isActionItem(item)) {
                const label =
                  item.action === "toggle-theme"
                    ? themeLabel
                    : item.name;

                const DisplayIcon =
                  item.action === "toggle-theme" ? ThemeIcon : Icon;

                return (
                  <li key={item.name}>
                    <button
                      type="button"
                      onClick={() => handleAction(item.action)}
                      className={`${baseClasses} dark:text-gray-400 dark:hover:text-[#f8fafc]`}
                    >
                      <DisplayIcon />
                      <span className="font-medium text-sm">
                        {label}
                      </span>
                    </button>
                  </li>
                );
              }

              return null;
            })}
          </ul>
        </nav>
      </>
    );
  }
};

export default Sidebar;
