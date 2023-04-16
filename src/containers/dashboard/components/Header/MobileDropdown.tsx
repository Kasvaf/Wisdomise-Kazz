import LeftNavTabs from "components/Layout/LeftNavTabs";
import { ReactComponent as Hamburger } from "@images/menu.svg";
import { ReactComponent as Close } from "@images/close.svg";

interface IProps {
  onToggle: (n?: any) => void;
  isOpen: boolean;
}

export default function MobileDropdown({ onToggle, isOpen }: IProps) {
  return (
    <>
      <button type="button" className="group md:hidden" onClick={onToggle}>
        {isOpen ? (
          <Close className="fill-white group-hover:fill-primary" />
        ) : (
          <Hamburger className="stroke-white group-hover:stroke-primary" />
        )}
      </button>
      {isOpen && (
        <div className="absolute inset-x-0 top-full z-10 mt-1 flex flex-col space-y-2 rounded-sm border border-nodata/20 bg-bgcolor p-4">
          <LeftNavTabs collapseNavbar={false} setShowMenu={onToggle} />
        </div>
      )}
    </>
  );
}
