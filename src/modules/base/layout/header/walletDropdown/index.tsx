import { ReactComponent as ChevronDown } from '@images/chevron-down.svg';
import { Dropdown } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useInvestorAssetStructuresQuery } from 'api';
import DropdownContainer from '../DropdownContainer';
import WalletDropdownContent from './WalletDropdownContent';

const WalletDropdown = () => {
  const [openState, setOpenState] = useState(false);
  const setClose = useCallback(() => setOpenState(false), []);

  const dropDownFn = useCallback(
    () => (
      <DropdownContainer className="w-80 bg-[#272A32] !p-4">
        <WalletDropdownContent closeDropdown={setClose} />
      </DropdownContainer>
    ),
    [setClose],
  );

  const ias = useInvestorAssetStructuresQuery();
  const hasWallet = Boolean(ias?.data?.[0]?.main_exchange_account);

  useEffect(() => {
    if (openState) {
      void ias.refetch();
    }
  }, [openState, ias]);

  return (
    <div className="ml-auto flex">
      {hasWallet && (
        <div className="mx-4 flex items-center justify-evenly px-4">
          <div className="ml-4 min-w-0 grow-0">
            <Dropdown
              open={openState}
              trigger={['click']}
              onOpenChange={setOpenState}
              placement="bottomRight"
              dropdownRender={dropDownFn}
            >
              <div className="flex items-center">
                <button className="flex text-white">
                  <p className="px-2 font-medium">Wallet</p>
                  <ChevronDown className="w-6 fill-white" />
                </button>
              </div>
            </Dropdown>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletDropdown;
