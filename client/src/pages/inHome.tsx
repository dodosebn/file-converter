import { Uploader } from "../components/in";
import { RecommendedTools, Sidebar } from "../components/in/ui";

const InHome = () => {
  return (
    <div className="bg-[#f0f6ff] px-6">
      <div className="flex gap-6 py-4 items-start">
        <div className="sticky top-4">

        <Sidebar />
</div>
        <div className="max-w-7xl flex-1 mx-auto space-y-4">
          <Uploader />
          <RecommendedTools />
        </div>
      </div>
    </div>
  );
};

export default InHome;
