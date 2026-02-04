import { TextAlignJustify } from "lucide-react";
import { Logo } from "../..";

type MobileNavProps = {
  onMenuClick: () => void;
};

const MobileNav = ({ onMenuClick }: MobileNavProps) => {

  return (
    <nav className="md:hidden flex justify-between items-center">
      <div>
<Logo />
      </div>
      <button onClick={onMenuClick}>
        <TextAlignJustify className='h-5 w-5'/>
      </button>
    </nav>
  )
}

export default MobileNav;