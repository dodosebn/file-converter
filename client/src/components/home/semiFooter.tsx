import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const SemiFooter = () => {
  return (
    <div>
      <section className="container  mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto text-center p-12 rounded-3xl gradient-card">
          <h2 className="text-3xl font-bold text-[#fff] mb-4">
            Ready to Transform Your Files?
          </h2>
          <p className="text-[#fff]/80 mb-8 max-w-xl mx-auto">
            Join thousands of users who trust FastConvert for their file
            conversion needs.
          </p>
          <Link to="/signup">
          <button
  className="
    flex flex-row flex-nowrap items-center justify-center gap-2
    bg-[#fff] hover:bg-[#fff]/70
    transition-all duration-300 origin-top-left transform
    rounded-lg mx-auto
    text-lg font-semibold
    px-6 py-3
    whitespace-nowrap shrink-0
  "
>
  Create Free Account
  <ArrowRight className="w-5 h-5" />
</button>

          </Link>
        </div>
      </section>
    </div>
  );
};

export default SemiFooter;
