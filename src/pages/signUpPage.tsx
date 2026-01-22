import { SignUpForm, SignUpRightty } from "../components/account";

const signUpPage = () => {
  return (
    <main className="bg-[#f0f6ff]  h-screen md:h-auto">
    <div className='md:pl-3 pl-0 py-1'>
    <div className="flex">
      <SignUpRightty />
      <div className="justify-center flex mx-auto mt-8">
      <SignUpForm />
      </div>
      </div>
    </div>
    </main>
  )
}

export default signUpPage;
