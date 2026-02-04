import {
  CircleCheckBig,
  Download,
  Ellipsis,
  FileImage,
  Trash2,
} from "lucide-react";

const ConvertAlert = () => {
  return (
    <main>
      <section className="flex justify-between items-center">
        <div className="flex gap-2 items-center ">
          <span className="bg-[#e6f5fc] p-2 rounded-md">
            <FileImage className="md:w-6 md:h-6 w-4 h-4 text-blue-500" />
          </span>
          <span className="md:font-semibold font-medium text-gray-800 text-md md:text-lg">
            ImgName.jpg
          </span>
        </div>
        <div>
          <ul className="flex gap-x-6">
            <li className="text-green-600 mx-auto hidden md:flex items-center gap-x-2">
              <CircleCheckBig className="text-green-500 w-4 h-4" />
              Converted
            </li>
            <li>3.5mb</li>
            <li>
              <Download className="w-5 h-5 text-gray-700" />
            </li>
            <li>
              <Ellipsis className="w-5 h-5 text-gray-500 transform rotate-90" />
            </li>
          </ul>
        </div>
      </section>
      <div className="border-t border-gray-300 my-6">
       <div className="flex flex-col md:flex-row md:justify-between pt-6 gap-4 items-stretch md:items-center">
  <div className="flex gap-x-3 items-center">
    <p>Total 3 Files</p>
    <button className="flex items-center gap-x-2 font-medium text-red-600">
      <Trash2 className="w-4 h-4" />
      Clear All
    </button>
  </div>

  <div className="w-full md:w-auto">
    <button
      className="
        w-full md:w-auto
        flex items-center justify-center gap-2
        rounded-md gradient-card
        px-3 py-2
        text-white font-medium
        hover:opacity-90 transition
      "
    >
      <Download className="w-4 h-4 text-white" />
      Download All
    </button>
  </div>
</div>

      </div>
    </main>
  );
};

export default ConvertAlert;
