import { ForgotForm, SignUpRightty } from "../components/auth";

const ForgotPage = () => {
  return (
      <main className="bg-[#f0f6ff] dark:bg-[#0f1729] h-screen md:h-auto container
         mx-auto px-4 sm:px-0 ">
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