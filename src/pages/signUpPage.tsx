import { SignUpForm, SignUpRightty } from "../components/account";

const signUpPage = () => {
  return (
    <main className="bg-[#f0f6ff]">
    <div className='pl-3 py-1'>
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
