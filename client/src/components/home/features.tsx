import { someSay } from "./data";

const Features = () => {
  return (
    <section>
    <div className="container mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl dark:text-[#f8fafc] font-bold text-foreground mb-4">
          Everything You Need for File Conversion
        </h2>
        <p className="text-muted-foreground dark:text-gray-400 max-w-2xl mx-auto">
          Powerful features designed to make your file conversion workflow
          seamless and efficient.
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {someSay.map((say, index) => (
          <div
            key={index}
            className="p-6 rounded-2xl bg-[#ffffff] dark:bg-[#141f38] border border-border dark:border-gray-800 shadow-card hover:shadow-card-hover transition-shadow"
          >
            <div className="w-12 h-12 rounded-xl bg-[#e6f5fc] dark:bg-[#132c49] flex items-center justify-center mb-4">
              <say.icon className="w-6 h-6 text-[#0ea2e7] dark:text-blue-500" />
            </div>
            <h3 className="text-lg font-bold text-[#000] dark:text-[#f8fafc] mb-2">
              {say.title}
            </h3>
            <p className="text-[#68788e] dark:text-gray-400 ">{say.descrip}</p>
          </div>
        ))}
      </div>
    </div>
    </section>
  );
};

export default Features;
