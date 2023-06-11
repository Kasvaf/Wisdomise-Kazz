import { ReactComponent as CloseIcon } from "@images/close.svg";
import { Network } from "api/types/transferNetworks";
import GradientBox from "components/gradientBox";

interface IProps {
  onCloseSelectNetwork: () => void;
  networks: Network[];
  selectedNetwork: Network;
  onSelectNetwork: (n: Network) => void;
  isDeposit?: boolean;
}

const SelectNetwork = ({
  networks,
  onCloseSelectNetwork,
  onSelectNetwork,
  selectedNetwork,
  isDeposit = false,
}: IProps) => {
  return (
    <>
      <div className="mb-2 flex w-full justify-between  pb-5 pt-2">
        <p className="text-xl text-white">Select network</p>
        <CloseIcon
          className="cursor-pointer fill-white"
          onClick={onCloseSelectNetwork}
        />
      </div>
      <div className="flex flex-col">
        <p className="mb-8  text-gray-light">
          {isDeposit
            ? `Please ensure that the selected deposit network is the same as the
            withdrawal network. Otherwise, your assets could be lost.`
            : `Please ensure your receiving platform supports the token and network
          you are withdrawing. If you are unsure, kindly check with the receiving
          platform first.`}
        </p>
        <GradientBox selected className="mb-8">
          <p className="font-bold text-white">
            Unmatched networks automatically removed. Select a network
          </p>
        </GradientBox>
        {networks &&
          networks.map((item: any) => {
            return (
              <div
                className={`mb-4 flex cursor-pointer justify-between p-4  hover:bg-gray-main ${
                  selectedNetwork?.name === item.name && "border "
                }`}
                onClick={() => onSelectNetwork(item)}
                key={item.key}
              >
                <div className="flex flex-col">
                  <p className="text-base text-white">{item.name}</p>
                  <p className="text-sm text-gray-light">{item.description}</p>
                </div>
                {item.binance_info && (
                  <div className="flex flex-col">
                    <div className="flex">
                      <p className=" mr-1 text-gray-light">Arrival time ≈</p>
                      <p className="text-white">10 min</p>
                    </div>
                    <div className="flex">
                      <p className=" mr-1 text-gray-light">Fee </p>
                      <p className="text-white">
                        {item.binance_info.withdrawFee} BUSD
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </>
  );
};

export default SelectNetwork;
