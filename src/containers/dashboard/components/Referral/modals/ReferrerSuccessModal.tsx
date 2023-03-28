import type { FC } from "react";
import Modal from "components/modal";
import successImage from "@images/success-check.png";
import Button from "components/Button";
import { BUTTON_TYPE } from "utils/enums";

interface ReferrerSuccessModalProps {
  onOk: () => void;
}

const ReferrerSuccessModal: FC<ReferrerSuccessModalProps> = ({ onOk }) => {
  return (
    <Modal
      backdropClassName="bg-[rgba(1,7,12,0.8)] fixed"
      className="!w-full bg-gradient-to-b from-[#0D1F31] to-[#03101C] shadow-none sm:!w-[700px]"
    >
      <div className="flex flex-col gap-8 p-20 text-center">
        <img
          className="mx-auto aspect-square w-[100px]"
          src={successImage}
          alt="Invitation Successful"
        />
        <div className="flex flex-col gap-4">
          <p className="font-inter text-sm font-medium text-white/60">
            Your referrer code has been successfully submitted.
          </p>
        </div>
        <div className="mx-auto grid w-full max-w-[134px] place-items-center">
          <Button
            type={BUTTON_TYPE.FILLED}
            onClick={() => {
              onOk();
            }}
            text="Done"
          />
        </div>
      </div>
    </Modal>
  );
};

export default ReferrerSuccessModal;
