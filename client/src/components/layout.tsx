import { useLocation } from "react-router-dom";
import { Footer, Navbar } from "./home";
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
 const location = useLocation();

  const showNavbar = location.pathname.startsWith("/in");
  return (
    <>
      <div className="bg-[#f0f6ff] dark:bg-[#0f1729] ">              {!showNavbar && <Navbar />}

        <main>{children}</main>
        <Footer />
      </div>{" "}
    </>
  );
};
export default Layout;
