import { useState } from 'react';
import Button from 'shared/Button';
import { DrawerModal } from 'shared/DrawerModal';
import { useGamificationProfile } from 'api/gamification';
import safeBox from './safe-box.png';
import usdt from './usdt.png';
import bg from './bg.png';

export default function RewardModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { data } = useGamificationProfile();
  const [lastRewardAmount] = useState(
    data?.profile.customAttributes.boxRewardAmount,
  );

  return (
    <DrawerModal
      open={open}
      maskClosable={true}
      closeIcon={null}
      onClose={onClose}
    >
      <img
        src={bg}
        alt=""
        className="absolute end-0 top-0 w-full rounded-3xl"
      />
      <div className="relative mb-20 flex flex-col items-center">
        <img src={safeBox} alt="safeBox" className="absolute" />

        <div className="flex h-[19rem] flex-col items-center text-center">
          <h1 className="-mt-5 text-center font-bold text-v1-content-positive">
            You Have Won!
          </h1>
          <img src={usdt} alt="usdt" className="my-5 h-28 w-auto" />
          <div className="text-4xl font-bold">{lastRewardAmount} USDT</div>
          <p className="mt-auto text-v1-content-secondary">
            To withdraw your token, please go to your profile page and follow
            the withdrawal instructions from there.
          </p>
        </div>
      </div>
      <Button
        variant="alternative"
        className="absolute bottom-6 end-4 start-4 z-10"
        onClick={onClose}
      >
        Close
      </Button>
    </DrawerModal>
  );
}
