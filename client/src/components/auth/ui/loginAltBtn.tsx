import type { ReactNode } from "react";

type LoginAltBtnProp = {
    children: ReactNode;       
    onClickBtn: () => void;    
}

const LoginAltBtn = ({ children, onClickBtn }: LoginAltBtnProp) => {
  return (
    <button
      onClick={onClickBtn}
      type="button"
      className="flex-1 flex items-center justify-center gap-2 dark:bg-[#0f1729] rounded-lg border
                 border-gray-300 dark:border-[#0f1729] py-3 text-sm hover:bg-[#25cac5] dark:text-[#f8fafc] transition"
    >
      {children}
    </button>
  );
}

export default LoginAltBtn;
