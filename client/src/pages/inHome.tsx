import { useState } from "react";
import { Uploader } from "../components/in";
import { MobileNav, RecommendedTools, Sidebar } from "../components/in/ui";

const InHome = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="bg-[#f0f6ff] dark:bg-[#0f1729] min-h-screen px-4 sm:px-6 py-3">
      <MobileNav onMenuClick={() => setSidebarOpen(true)} />

      <Sidebar
        mobile
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex gap-6 py-4 items-start">
        <div className="hidden md:block md:sticky md:top-4">
          <Sidebar />
        </div>

        <main className="w-full max-w-7xl mx-auto space-y-4">
          <Uploader />
          <RecommendedTools />
        </main>
      </div>
    </div>
  );
};

export default InHome;
