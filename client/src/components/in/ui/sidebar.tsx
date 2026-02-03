import { Logo } from "../..";
import { SideItems } from "../data";

const Sidebar = () => {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
      <div className="mb-10">
        <Logo />
      </div>

      <nav>
        <ul className="space-y-1">
          {SideItems.map((item, index) => {
            const Icon = item.icon;
            const baseClasses =
              "flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150 w-full";

            return (
              <li key={index}>
                {item.path ? (
                  // 🔗 Navigation item
                  <a href={item.path} className={baseClasses}>
                    <Icon width={20} height={20} className="text-gray-500" />
                    <span className="font-medium text-sm">{item.name}</span>
                  </a>
                ) : (
                  // ⚙️ Action item (theme switch)
                  <button
                    type="button"
                    onClick={item.action}
                    className={baseClasses}
                  >
                    <Icon width={20} height={20} className="text-gray-500" />
                    <span className="font-medium text-sm">{item.name}</span>
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
