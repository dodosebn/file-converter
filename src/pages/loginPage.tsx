import { LoginForm, SignUpRightty } from "../components/account";

const LoginPage = () => {
  return (
    <main className="bg-[#f0f6ff]">
    <div className='pl-3 py-1'>
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
