import { useNavigate } from 'react-router-dom';
import { Button } from 'shared/v1-components/Button';
import bg from './images/bg.png';
import usdc from './images/usdc.svg';
import video from './images/video.webm';

export default function RewardModalContent({ amount }: { amount: number }) {
  const navigate = useNavigate();

  return (
    <div>
      <img
        alt=""
        className="absolute end-0 top-0 h-full w-full mobile:rounded-3xl rounded-xl"
        src={bg}
      />
      <video
        autoPlay
        className="absolute top-0 h-full w-full object-cover opacity-50 mix-blend-exclusion"
        muted
        playsInline
      >
        <source src={video} />
      </video>
      <div className="mobile:-mt-8 relative mb-20 flex flex-col items-center">
        <div className="flex h-[19rem] flex-col items-center text-center">
          <h1 className="mt-3 text-center font-bold text-2xl">
            Reward Claimed
          </h1>
          <p className="mt-3 mb-8 text-v1-content-secondary">
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
              <img alt="usdt" className="size-8 w-auto" src={usdc} />
              <span className="font-semibold text-4xl">{amount}</span>
            </div>
            <hr className="mt-6 mb-3 border border-v1-border-primary/20" />
            <div>USDC</div>
          </div>
          <p className="mt-6 text-v1-content-secondary text-xs">
            To withdraw your token, please go to rewards page and follow the
            instructions.
          </p>
        </div>
      </div>
      <Button
        className="w-full"
        onClick={() => navigate('/account/rewards')}
        variant="white"
      >
        Go to Rewards Page
      </Button>
    </div>
  );
}
