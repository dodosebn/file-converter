import { Logo } from "../..";
import { SideItems } from "../data";

const Sidebar = () => {
  return (
    <div className="bg-white h-screen rounded-xl p-6 border border-gray-200 shadow-sm">
      {/* Logo with proper spacing */}
      <div className="mb-10">
        <Logo />
      </div>

      {/* Navigation items with sharp styling */}
      <nav>
        <ul className="space-y-1">
          {SideItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <li key={index}>
                <a 
                  href="#" 
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150"
                >
                  <Icon width={20} height={20} className="text-gray-500" />
                  <span className="font-medium text-sm">{item.name}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;