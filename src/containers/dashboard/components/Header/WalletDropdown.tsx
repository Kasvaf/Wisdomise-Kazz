import { useNavigate } from "react-router-dom";
import { Dropdown } from "antd";
import { useGetInvestorAssetStructureQuery } from "api/horosApi";
import { ReactComponent as ChevronDown } from "@images/chevron-down.svg";
import { ReactComponent as WithdrawIcon } from "@images/withdraw.svg";
import { ReactComponent as DepositIcon } from "@images/deposit.svg";
import { ReactComponent as NewWallet } from "@images/new_wallet.svg";
import { floatData } from "utils/utils";

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

  const hasWallet =
    (investorAsset?.data?.[0]?.financial_product_instances.length || 0) > 0;

  return (
    <div className="ml-auto flex">
      {hasWallet && (
        <div className="mx-4 flex items-center justify-evenly border-r-2 border-gray-main px-4">
          <div className="ml-4 min-w-0 grow-0">
            <Dropdown
              overlay={
                <div className="mt-1 flex  flex-col space-y-2 rounded-sm border border-nodata/20 bg-bgcolor p-4">
                  <div className="flex justify-between border-b-2 border-b-gray-200 p-4 md:hidden">
                    <p className="font-bold uppercase text-primary">wallet</p>
                    <p className="font-bold text-primary">
                      ${hasWallet ? floatData(mea?.total_equity) : 0}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={onShowDepositPage}
                    className="flex items-center justify-start bg-transparent p-4  text-white hover:bg-gray-dark"
                  >
                    <DepositIcon className="mr-2 w-[20px] text-2xl" />
                    Deposit
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onShowWithdrawPage();
                    }}
                    className=" flex items-center justify-start bg-transparent px-4 py-3   text-white hover:bg-gray-dark"
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
                  <p className="font-bold text-primary">
                    ${hasWallet ? floatData(mea?.total_equity) : 0}
                  </p>
                  <ChevronDown className="w-6" />
                </button>
              </div>
            </Dropdown>
          </div>
        </div>
      )}
    </div>
  );
}
