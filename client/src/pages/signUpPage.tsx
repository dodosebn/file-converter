import { SignUpForm, SignUpRightty } from "../components/auth";

const signUpPage = () => {
  return (
    <main
      className="bg-[#f0f6ff] dark:bg-[#0f1729]  h-screen md:h-auto container
       mx-auto px-4 sm:px-0 "
    >
      <div className="md:pl-3 pl-0 py-1">
        <div className="flex">
          <SignUpRightty />
          <div className="justify-center flex mx-auto mt-8">
            <SignUpForm />
          </div>
        </div>
      </div>
    </main>
  );
};

export default signUpPage;
