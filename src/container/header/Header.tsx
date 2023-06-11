import React, { useCallback, useState, useTransition } from "react";
import UserDropdown from "./UserDropdown";
import WalletDropdown from "./WalletDropdown";

interface Props {
  signOut: () => unknown;
}

export const Header: React.FC<Props> = ({ signOut }) => {
  const [, startTransition] = useTransition();
  const [walletDropdownOpen, setWalletDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const closeAll = useCallback(() => {
    setWalletDropdownOpen(false);
    setUserDropdownOpen(false);
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
    <div className="relative mb-4 flex w-full justify-between">
      <WalletDropdown isOpen={walletDropdownOpen} onToggle={toggleWallet} />
      <UserDropdown
        isOpen={userDropdownOpen}
        onToggle={toggleUser}
        onSignout={signOut}
      />
    </div>
  );
};
