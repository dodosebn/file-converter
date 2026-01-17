import {
  Features,
  Footer,
  MainIntro,
  Navbar,
  SemiFooter,
} from "../components/home";

const HomePage = () => {
  return (
    <div>
      <Navbar />
      <MainIntro />
      <Features />
      <SemiFooter />
      <Footer />
    </div>
  );
};

export default HomePage;
