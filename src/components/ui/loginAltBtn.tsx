import type { ReactNode } from "react";
type LoginAltBtnProp  = {
    children:  ReactNode;
}
const LoginAltBtn = ({children}: LoginAltBtnProp) => {
  return (
     <button
               type="button"
               className="flex-1 flex items-center justify-center gap-2 rounded-lg border
                border-gray-300 py-3 text-sm hover:bg-[#25cac5]  transition"
             >
              {children}
             </button>
  )
}

export default LoginAltBtn;
