import { useLocation } from "react-router-dom";
import { Navbar } from "./home";
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const hideNavbarPaths = ["/tasks"];
  const showNavbar = !hideNavbarPaths.includes(location.pathname);
  return (
    <>
      <div className="bg-[#f0f6ff]  ">        {showNavbar && <Navbar />}
        <main>{children}</main>
      </div>{" "}
    </>
  );
};
export default Layout;
