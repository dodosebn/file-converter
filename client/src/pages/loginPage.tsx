import { LoginForm, SignUpRightty } from "../components/account";

const LoginPage = () => {
  return (
    <main className="bg-[#f0f6ff] h-screen md:h-auto container mx-auto px-4 sm:px-6 py-4 flex flex-row
       flex-nowrap items-center justify-between">
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
