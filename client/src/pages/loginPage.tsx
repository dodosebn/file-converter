import { LoginForm, SignUpRightty } from "../components/auth";

const LoginPage = () => {
  return (
    <main className="bg-[#f0f6ff] h-screen md:h-auto container
       mx-auto px-4 sm:px-0 ">
    <div className='md:pl-3 pl-0 py-1'>
    <div className="flex">
      <SignUpRightty />
      <div className="justify-center flex mx-auto mt-8">
      <LoginForm />
      </div>
      </div>
    </div>
    </main>
  )
}

export default LoginPage;
