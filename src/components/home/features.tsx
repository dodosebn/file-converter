import { someSay } from "./data";

const Features = () => {
  return (
    <section className="bg-[#f0f6ff] ">
    <div className="container mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-foreground mb-4">
          Everything You Need for File Conversion
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Powerful features designed to make your file conversion workflow
          seamless and efficient.
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {someSay.map((say, index) => (
          <div
            key={index}
            className="p-6 rounded-2xl bg-[#ffffff] border border-border shadow-card hover:shadow-card-hover transition-shadow"
          >
            <div className="w-12 h-12 rounded-xl bg-[#e6f5fc] flex items-center justify-center mb-4">
              <say.icon className="w-6 h-6 text-[#0ea2e7]" />
            </div>
            <h3 className="text-lg font-bold text-[#000] mb-2">
              {say.title}
            </h3>
            <p className="text-[#68788e] ">{say.descrip}</p>
          </div>
        ))}
      </div>
    </div>
    </section>
  );
};

export default Features;
