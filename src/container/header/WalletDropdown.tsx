import { ReactComponent as ChevronDown } from "@images/chevron-down.svg";
import { Dropdown } from "antd";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "shared/components/Button";
import { useInvestorAssetStructuresQuery } from "shared/services";
import { roundDown } from "utils/utils";
import { DropdownContainer } from "./components";
import DepositImgSrc from "./deposit.svg";
import WithdrawImgSrc from "./withdraw.svg";
interface IProps {
  onToggle: (n?: any) => void;
  isOpen: boolean;
}

export default function WalletDropdown({ onToggle, isOpen }: IProps) {
  const navigate = useNavigate();
  const ias = useInvestorAssetStructuresQuery();

  const onShowDepositPage = () => {
    onToggle(false);
    navigate(`/app/deposit/${ias?.data?.[0]?.main_exchange_account?.key}`);
  };

  const onShowWithdrawPage = () => {
    onToggle(false);
    navigate("/app/withdraw");
  };

  useEffect(() => {
    if (isOpen) {
      ias.refetch();
    }
  }, [isOpen]);

  const hasWallet = ias?.data?.[0]?.main_exchange_account;

  const totalBalance = ias.data?.[0]?.total_equity || 0;
  const withdrawable = ias.data?.[0]?.main_exchange_account.quote_equity || 0;

  return (
    <div className="ml-auto flex">
      {hasWallet && (
        <div className="mx-4 flex items-center justify-evenly px-4">
          <div className="ml-4 min-w-0 grow-0">
            <Dropdown
              open={isOpen}
              trigger={["click"]}
              onOpenChange={onToggle}
              placement="bottomRight"
              dropdownRender={() => (
                <DropdownContainer className="w-80 bg-[#272A32] !p-4">
                  <div className="flex justify-around gap-2 rounded-lg bg-white/5 p-4 text-nodata">
                    <div className="flex flex-col items-center ">
                      <p className="text-xs text-white/80">Total Balance</p>
                      <p className="text-white">
                        {roundDown(totalBalance)}{" "}
                        <span className="text-white/80">BUSD</span>
                      </p>
                    </div>
                    <div className="border-l border-white/10" />
                    <div className="flex flex-col items-center ">
                      <p className="text-xs text-white/80">Withdrawable</p>
                      <p className="text-white">
                        {roundDown(withdrawable)}{" "}
                        <span className="text-white/80">BUSD</span>
                      </p>
                    </div>
                  </div>
                  {(ias.data?.[0]?.financial_product_instances.length || 0) >
                    0 && (
                    <p className="mt-2 px-2 text-center text-xs  text-white/80">
                      You Have <span className="text-white">1</span> Running
                      Product <br /> That Block{" "}
                      <span className="text-white">
                        {roundDown(totalBalance - withdrawable)}
                      </span>{" "}
                      BUSD Of Your Equity
                    </p>
                  )}
                  <div className="mt-6 flex justify-around text-xs">
                    <Button
                      variant="link"
                      onClick={onShowDepositPage}
                      className="item flex flex-col items-center justify-center gap-2 !p-0"
                    >
                      <img src={DepositImgSrc} />
                      Deposit
                    </Button>

                    <Button
                      variant="link"
                      onClick={onShowWithdrawPage}
                      className="item flex flex-col items-center justify-center gap-2 !p-0"
                    >
                      <img src={WithdrawImgSrc} />
                      Withdraw
                    </Button>
                  </div>
                </DropdownContainer>
              )}
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
}
