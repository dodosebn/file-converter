import { ForgotForm, SignUpRightty } from "../components/account";

const ForgotPage = () => {
  return (
      <main className="bg-[#f0f6ff] h-screen md:h-auto container mx-auto px-4 sm:px-6 py-4 flex flex-row
       flex-nowrap items-center justify-between">
    <div className='md:pl-3 pl-0 py-1'>
    <div className="flex">
      <SignUpRightty />
      <div className="justify-center mx-auto mt-8">
       <ForgotForm /> 
      </div>
      </div>
    </div>
    </main>
 
  )
}

export default ForgotPage;