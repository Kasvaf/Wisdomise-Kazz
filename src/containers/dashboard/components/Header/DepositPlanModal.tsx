import GradientBox from "components/gradientBox";
import { ReactComponent as CloseIcon } from "@images/close.svg";
import Modal from "components/modal";

interface IProps {
  toggle: () => void;
}

export default function ({ toggle }: IProps) {
  return (
    <Modal className="!w-full sm:!w-[700px]">
      <div className="mb-2 flex w-full justify-between px-2 pb-5 pt-2">
        <p className="font-body text-xl text-white">Subscription Plans</p>
        <CloseIcon className="cursor-pointer fill-white" onClick={toggle} />
      </div>
      <div className="flex flex-col">
        <GradientBox selected onClick={toggle}>
          <div className="flex min-w-[230px] items-start">
            <p className="font-bold text-white">30-days free trial</p>
          </div>
        </GradientBox>
        <GradientBox disabled>
          <div className="flex flex-col ">
            <p className="self-start font-bold text-white">Rabbit</p>
            <div className="flex flex-row items-center justify-between">
              <p className="text-xs text-gray-light"> Wallet size under $1k</p>
              <p className="text-sm text-white">$9 per month</p>
            </div>
          </div>
        </GradientBox>
        <GradientBox disabled>
          <div className="flex flex-col">
            <p className="self-start font-bold text-white">Lion</p>
            <div className="flex flex-row items-center justify-between">
              <p className="text-xs text-gray-light">
                {" "}
                Wallet size between $1k - $3k
              </p>
              <p className="text-sm text-white">$29 per month</p>
            </div>
          </div>
        </GradientBox>
        <GradientBox disabled>
          <div className="flex flex-col">
            <p className="self-start font-bold text-white">Eagle</p>
            <div className="flex flex-row items-center justify-between">
              <p className="text-xs text-gray-light">
                {" "}
                Wallet size between $5k - $10k
              </p>
              <p className="text-sm text-white">$49 per month</p>
            </div>
          </div>
        </GradientBox>
        <GradientBox disabled>
          <div className="flex flex-col">
            <p className="self-start font-bold text-white">Shark</p>
            <div className="flex flex-row items-center justify-between">
              <p className="text-xs text-gray-light">
                {" "}
                Wallet size between $10k - $50k
              </p>
              <p className="text-sm text-white">
                20% profit sharing + 2% of wallet size management fee
              </p>
            </div>
          </div>
        </GradientBox>
        <GradientBox disabled>
          <div className="flex flex-col">
            <p className="self-start font-bold text-white">Whale</p>
            <div className="flex flex-row items-center justify-between">
              <p className="text-xs text-gray-light">Wallet size over $50k+</p>
              <p className="text-sm text-white">
                10% profit sharing + 1% of wallet size management fee
              </p>
            </div>
          </div>
        </GradientBox>
      </div>
    </Modal>
  );
}
