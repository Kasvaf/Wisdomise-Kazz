import { useCallback, useState, useTransition } from "react";
import MobileDropdown from "./MobileDropdown";
import UserDropdown from "./UserDropdown";
import WalletDropdown from "./WalletDropdown";

interface HeaderProps {
  signOut: () => unknown;
}

function Header({ signOut }: HeaderProps) {
  const [_, startTransition] = useTransition();
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [walletDropdownOpen, setWalletDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const closeAll = useCallback(() => {
    setMobileDropdownOpen(false);
    setWalletDropdownOpen(false);
    setUserDropdownOpen(false);
  }, []);

  const toggleMobile = useCallback(() => {
    startTransition(() => {
      closeAll();
      setMobileDropdownOpen((p) => !p);
    });
  }, []);

  const toggleWallet = useCallback(() => {
    startTransition(() => {
      closeAll();
      setWalletDropdownOpen((p) => !p);
    });
  }, []);

  const toggleUser = useCallback(() => {
    startTransition(() => {
      closeAll();
      setUserDropdownOpen((p) => !p);
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
