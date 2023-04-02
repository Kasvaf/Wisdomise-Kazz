import type { FC } from "react";
import Modal from "components/modal";
// import successImage from "@images/success-check.png";
import Button from "components/Button";
import { BUTTON_TYPE } from "utils/enums";
import ReferralLevelBadge from "../ReferralLevel/ReferralLevelBadge";

interface ReferrerSuccessModalProps {
  message?: string;
  onOk?: () => void;
  level: number;
}

const LevelUpModal: FC<ReferrerSuccessModalProps> = ({
  message,
  onOk,
  level,
}) => {
  return (
    <Modal
      backdropClassName="bg-[rgba(1,7,12,0.8)] fixed"
      className="!w-full bg-gradient-to-b from-[#0D1F31] to-[#03101C] shadow-none sm:!w-[700px]"
    >
      <div className="flex flex-col gap-8 px-20 py-16 text-center">
        <div
          className="grid h-[140px] place-items-center bg-[url(@images/referral/confetti.svg)] bg-no-repeat"
          style={{ backgroundPosition: "center", backgroundSize: "2000% 100%" }}
        >
          <ReferralLevelBadge
            className={"scale-[1.57]"}
            claimed
            level={level}
            progress={0}
          />
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="font-poppins text-3xl font-semibold text-white">
            Congratulation!
          </h2>

          {message && (
            <p className="font-inter text-sm font-medium text-white/60">
              {message}
            </p>
          )}
        </div>
        <div className="mx-auto grid w-full max-w-[134px] place-items-center">
          <Button
            type={BUTTON_TYPE.FILLED}
            onClick={() => {
              onOk && onOk();
            }}
            text="Done"
          />
        </div>
      </div>
    </Modal>
  );
};

export default LevelUpModal;
