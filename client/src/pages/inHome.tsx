import { Uploader } from "../components/in";
import { Sidebar } from "../components/in/ui";

const InHome = () => {
  return (
    <div className="bg-[#f0f6ff] px-6 h-screen">
      <div className="flex gap-6 py-4">
        <Sidebar />
        <div className="max-w-7xl flex-1 mx-auto">

        <Uploader />
        </div>
        </div>
    </div>
  )
}

export default InHome;