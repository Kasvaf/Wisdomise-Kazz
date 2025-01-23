import { useState } from 'react';
import Button from 'shared/Button';
import DailyProgress from 'modules/autoTrader/PageHome/DailyTradeQuest/DailyProgress';
import { DrawerModal } from 'shared/DrawerModal';
import { useGamification } from 'api/gamification';
import { StatusBadge } from 'modules/autoTrader/PageTournaments/TournamentCard';
import target from './target.png';
import box from './box.png';
import { ReactComponent as Bg } from './bg.svg';
import { ReactComponent as Stars } from './stars.svg';

export default function DailyTradeQuest() {
  const [open, setOpen] = useState(false);
  const { activeDay, currentDay, enableClaim } = useGamification();

  const dayStatus = (index: number) => {
    if (index < activeDay) {
      if (currentDay >= index) return 'finished';
    } else if (index === activeDay) {
      return currentDay <= index ? 'active' : 'finished';
    } else {
      return 'upcoming';
    }
  };

  return (
    <>
      <div className="relative mb-4 flex items-center justify-between overflow-hidden rounded-2xl bg-v1-surface-l2 px-4 py-3">
        <img src={target} alt="" className="absolute end-10 h-full w-auto" />
        <Bg className="absolute top-0" />
        <div className="relative">
          <p className="text-sm">Daily Trade Quest</p>
          <p className="mt-3 text-xs text-v1-content-secondary">
            Complete Today&apos;s Trade to Keep Your Streak!
          </p>
          <Button
            variant="brand"
            className="mt-3 !px-4"
            onClick={() => setOpen(true)}
          >
            {enableClaim ? 'Claim Your Reward' : 'Start Today`s Trade'}
          </Button>
        </div>
        <DailyProgress />
      </div>
      <DrawerModal
        open={open}
        onClose={() => setOpen(false)}
        maskClosable={true}
        closeIcon={null}
      >
        <div className="mb-20 flex flex-col items-center">
          <h1 className="-mt-5 text-center font-bold">Daily Trade Quest</h1>
          <ul className="mt-6 ps-4 [&>li]:list-disc [&>p]:mb-3 [&>p]:text-v1-content-secondary">
            <li>Complete Today&apos;s Trade</li>
            <p>Trade Any Cryptocurrency to Progress Your Streak.</p>
            <li>Earn Progress</li>
            <p>
              Each Day You Trade, You&apos;ll Advance One Step Towards Unlocking
              the Reward.
            </p>
            <li>Keep the Streak</li>
            <p>
              Complete a Trade Every Day for 7 Days to Keep Your Streak alive.
              Miss a Day? the Process Resets.
            </p>
            <li>Unlock Rewards</li>
            <p>
              On Day 7, Earn a Reward Chest With Exclusive Items Like Coupons,
              Tokens (WSDM, USDT), and More.
            </p>
          </ul>
          <div className="mt-4 w-full rounded-2xl bg-v1-surface-l4 p-4">
            <h2>My Status:</h2>
            <p className="mb-6 mt-2 text-v1-content-secondary">
              Complete today&apos;s tradeto keep your streak!
            </p>
            <div className="flex gap-3">
              <div className="basis-1/2">
                {Array.from({ length: 7 }, (_, i) => i).map(index => (
                  <div
                    key={index}
                    className="mb-2 flex items-center justify-between rounded-lg bg-v1-surface-l5 p-2 text-xs"
                  >
                    <span>Day {index + 1}</span>
                    <StatusBadge statusValue={dayStatus(index) || 'active'} />
                  </div>
                ))}
              </div>
              <div className="basis-1/2">
                <DailyProgress />
                <hr className="my-3 border-v1-border-disabled" />
                <div className="relative mb-4 flex flex-col items-center overflow-hidden rounded-2xl bg-v1-surface-l2 p-3">
                  <h2>Special Reward</h2>
                  <Bg className="absolute top-0 h-full" />
                  <Stars className="absolute" />
                  <img src={box} className="my-4 h-16 w-16" />
                  <Button
                    size="small"
                    variant="brand"
                    className="w-full"
                    disabled={!enableClaim}
                  >
                    Claim
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <Button
            variant="brand"
            className="absolute bottom-6 end-4 start-4 z-10"
            onClick={() => {
              setOpen(false);
            }}
          >
            Trade Now
          </Button>
          <div className="pointer-events-none absolute bottom-0 end-0 start-0 h-32 w-full  bg-gradient-to-b from-[rgba(5,1,9,0.00)] from-0% to-v1-surface-l0/80 to-75%"></div>
        </div>
      </DrawerModal>
    </>
  );
}
