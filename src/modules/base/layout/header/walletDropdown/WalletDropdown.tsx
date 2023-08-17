import { ReactComponent as ChevronDown } from '@images/chevron-down.svg';
import { Dropdown } from 'antd';
import { useState } from 'react';
import { useInvestorAssetStructuresQuery } from 'api';
import { DropdownContainer } from '../components';
import { WalletDropdownContent } from './WalletDropdownContent';

export const WalletDropdown = () => {
  const [open, setOpen] = useState(false);
  const ias = useInvestorAssetStructuresQuery();

  const hasWallet = ias?.data?.[0]?.main_exchange_account;
  const dropDownFn = () => (
    <DropdownContainer className="w-80 bg-[#272A32] !p-4">
      <WalletDropdownContent closeDropdown={() => setOpen(false)} />
    </DropdownContainer>
  );

  return (
    <div className="ml-auto flex">
      {hasWallet != null && (
        <div className="mx-4 flex items-center justify-evenly px-4">
          <div className="ml-4 min-w-0 grow-0">
            <Dropdown
              open={open}
              trigger={['click']}
              onOpenChange={open => {
                setOpen(open);
                void ias.refetch();
              }}
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
