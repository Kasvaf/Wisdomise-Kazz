import { ReactComponent as DepositIcon } from "@images/deposit.svg";
import { ReactComponent as NewWallet } from "@images/new_wallet.svg";
import { ReactComponent as WithdrawIcon } from "@images/withdraw.svg";
import { Dropdown } from "antd";
import { useGetInvestorAssetStructureQuery } from "api/horosApi";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface IProps {
  onToggle: (n?: any) => void;
  isOpen: boolean;
}

export default function WalletDropdown({ onToggle, isOpen }: IProps) {
  const navigate = useNavigate();
  const investorAsset = useGetInvestorAssetStructureQuery({});
  const mea = investorAsset?.data?.[0]?.main_exchange_account;

  const onShowDepositPage = () => {
    onToggle(false);
    navigate(`/app/deposit/${mea?.key}`);
  };

  const onShowWithdrawPage = () => {
    onToggle(false);
    navigate("/app/withdraw");
  };

  useEffect(() => {
    if (isOpen) {
      investorAsset.refetch();
    }
  }, [isOpen]);

  const hasWallet = investorAsset?.data?.[0]?.main_exchange_account;

  const totalBalance = investorAsset.data?.[0]?.total_equity || 0;
  const withdrawable =
    investorAsset.data?.[0]?.main_exchange_account.quote_equity || 0;

  return (
    <div className="ml-auto flex">
      {hasWallet && (
        <div className="mx-4 flex items-center justify-evenly border-r-2 border-gray-main px-4">
          <div className="ml-4 min-w-0 grow-0">
            <Dropdown
              overlay={
                <div className="flex max-w-[280px] flex-col items-center rounded-sm border border-nodata/20 bg-bgcolor p-0">
                  <div className="flex justify-center gap-2 text-white">
                    <div className="flex flex-col items-center p-4">
                      <p>Total Balance</p>
                      <p>{totalBalance}</p>
                    </div>

                    <div className="flex flex-col items-center p-4">
                      <p>Withdrawable</p>
                      <p>{withdrawable}</p>
                    </div>
                  </div>
                  {totalBalance - withdrawable > 0 && (
                    <p className="px-2 text-center text-white">
                      You have 1 running product that block{" "}
                      {totalBalance - withdrawable} BUSD of your equity
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={onShowDepositPage}
                    className="flex w-full items-center justify-center bg-transparent  p-4 text-white  hover:bg-gray-dark"
                  >
                    <DepositIcon className="mr-2 w-[20px] text-2xl" />
                    Deposit
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onShowWithdrawPage();
                    }}
                    className=" flex w-full items-center justify-center bg-transparent px-4 py-3 text-white hover:bg-gray-dark"
                  >
                    <WithdrawIcon className="mr-2 w-[20px]" /> Withdraw
                  </button>
                </div>
              }
              trigger={["click"]}
              onVisibleChange={onToggle}
              visible={isOpen}
            >
              <div className="flex items-center">
                <NewWallet />
                <button className="horos-filter-btn-alt group hidden bg-transparent fill-white/50 px-0 py-2 normal-case hover:bg-transparent hover:fill-white hover:text-white md:flex">
                  <p className="px-2 font-bold uppercase text-primary">
                    wallet
                  </p>
                </button>
              </div>
            </Dropdown>
          </div>
        </div>
      )}
    </div>
  );
}
