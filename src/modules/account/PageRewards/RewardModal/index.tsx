import { useNavigate } from 'react-router-dom';
import { DrawerModal } from 'shared/DrawerModal';
import { Button } from 'shared/v1-components/Button';
import usdc from './usdc.svg';
import bg from './bg.png';
import video from './video.webm';

export default function RewardModal({
  open,
  amount,
  onClose,
}: {
  open: boolean;
  amount: number;
  onClose: () => void;
}) {
  const navigate = useNavigate();

  return (
    <DrawerModal
      open={open}
      maskClosable={true}
      closeIcon={null}
      onClose={onClose}
      className="[&>.ant-drawer-wrapper-body]:!bg-v1-surface-l1 [&_.ant-drawer-header]:!p-0"
    >
      <img
        src={bg}
        alt=""
        className="absolute end-0 top-0 h-full w-full rounded-3xl"
      />
      <video
        muted
        autoPlay
        playsInline
        className="absolute h-full w-full object-cover opacity-50 mix-blend-exclusion"
      >
        <source src={video} />
      </video>
      <div className="relative mb-20 flex flex-col items-center">
        <div className="flex h-[19rem] flex-col items-center text-center">
          <h1 className="mt-3 text-center text-2xl font-bold">
            Reward Claimed
          </h1>
          <p className="mb-8 mt-3 text-v1-content-secondary">
            You have claimed your reward
          </p>
          <div
            className="rounded-lg border border-v1-border-primary/20 p-6 text-center"
            style={{
              background:
                'linear-gradient(90deg, rgba(190, 81, 215, 0.10) 0%, rgba(45, 163, 214, 0.10) 100%)',
            }}
          >
            <div className="my-3 flex items-center gap-1">
              <img src={usdc} alt="usdt" className="size-8 w-auto" />
              <span className="text-4xl font-semibold">{amount}</span>
            </div>
            <hr className="mb-3 mt-6 border border-v1-border-primary/20" />
            <div>USDC</div>
          </div>
          <p className="mt-6 text-xs text-v1-content-secondary">
            To withdraw your token, please go to rewards page and follow the
            instructions.
          </p>
        </div>
      </div>
      <Button
        className="w-full"
        variant="white"
        onClick={() => navigate('/account/rewards')}
      >
        Go to Rewards Page
      </Button>
    </DrawerModal>
  );
}
