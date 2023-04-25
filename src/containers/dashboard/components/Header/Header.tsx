import { useCallback, useState, useTransition } from "react";
import MobileDropdown from "./MobileDropdown";
import UserDropdown from "./UserDropdown";
import WalletDropdown from "./WalletDropdown";

interface HeaderProps {
  signOut: () => unknown;
}

function Header({ signOut }: HeaderProps) {
  const [, startTransition] = useTransition();
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [walletDropdownOpen, setWalletDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const closeAll = useCallback(() => {
    setMobileDropdownOpen(false);
    setWalletDropdownOpen(false);
    setUserDropdownOpen(false);
  }, []);

  const toggleMobile = useCallback((newVal: any) => {
    if (![true, false].includes) {
      newVal = (p: boolean) => !p;
    }
    startTransition(() => {
      closeAll();
      setMobileDropdownOpen(newVal);
    });
  }, []);

  const toggleWallet = useCallback((newVal: any) => {
    if (![true, false].includes) {
      newVal = (p: boolean) => !p;
    }
    startTransition(() => {
      closeAll();
      setWalletDropdownOpen(newVal);
    });
  }, []);

  const toggleUser = useCallback((newVal: any) => {
    if (![true, false].includes) {
      newVal = (p: boolean) => !p;
    }
    startTransition(() => {
      closeAll();
      setUserDropdownOpen(newVal);
    });
  }, []);

  return (
    <div className="relative mb-8 flex w-full justify-between">
      <h1 className="mb-2 hidden font-campton text-xl text-white md:flex xl:text-2xl">
        Welcome
      </h1>
      <MobileDropdown isOpen={mobileDropdownOpen} onToggle={toggleMobile} />
      <WalletDropdown isOpen={walletDropdownOpen} onToggle={toggleWallet} />
      <UserDropdown
        isOpen={userDropdownOpen}
        onToggle={toggleUser}
        onSignout={signOut}
      />
    </div>
  );
}

export default Header;
