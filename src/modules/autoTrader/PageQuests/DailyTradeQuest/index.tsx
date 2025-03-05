import { useState } from 'react';
import { clsx } from 'clsx';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import DailyProgress from 'modules/autoTrader/PageQuests/DailyTradeQuest/DailyProgress';
import { DrawerModal } from 'shared/DrawerModal';
import { useGamification, useGamificationAction } from 'api/gamification';
import { StatusBadge } from 'modules/autoTrader/PageQuests/PageTournaments/TournamentCard';
import { StatusChip } from 'modules/autoTrader/PageQuests/StatusChip';
import { Button } from 'shared/v1-components/Button';
import video from 'modules/autoTrader/PageQuests/DailyTradeQuest/video.webm';
import RewardModal from './RewardModal';
import box from './box.png';
import { ReactComponent as Bg } from './bg.svg';
import { ReactComponent as Stars } from './stars.svg';
import { ReactComponent as Arrow } from './arrow.svg';
import { ReactComponent as Lock } from './lock.svg';

export default function DailyTradeQuest() {
  const [open, setOpen] = useState(false);
  const [openReward, setOpenReward] = useState(false);
  const {
    activeDay,
    currentDay,
    completedToday,
    completedAll,
    rewardClaimed,
    nextDayEndTimestamp,
    setRewardClaimed,
  } = useGamification();
  const { mutateAsync } = useGamificationAction();
  const navigate = useNavigate();

  const dayStatus = (index: number) => {
    if (index < activeDay) {
      if (currentDay >= index) return 'finished';
    } else if (index === activeDay) {
      return currentDay < index ? 'active' : 'finished';
    } else {
      return 'upcoming';
    }
  };

  const claim = () => {
    void mutateAsync({ event_name: 'claim' }).then(() => {
      setOpen(false);
      setOpenReward(true);
      setRewardClaimed(true);
      return null;
    });
  };

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="relative mb-4 flex items-center justify-between overflow-hidden rounded-2xl bg-v1-surface-l2 p-4"
      >
        <Bg className="absolute top-0 h-full" />
        <div className="relative">
          <h2 className="text-xl font-semibold">Daily Trade</h2>
          <p className="mt-3 max-w-40 text-xs text-v1-content-secondary">
            Complete Trades Daily and Earn Rewards.
          </p>

          {!completedToday && (
            <button
              className={clsx(
                'my-5 flex items-center text-xs',
                completedAll && rewardClaimed && 'hidden',
              )}
            >
              {completedAll ? 'Claim Your Reward' : "Start Today's Trade"}
              <Arrow className="ml-2" />
            </button>
          )}
          {currentDay > -1 && !completedToday && !completedAll && (
            <StatusChip className="mt-3">
              <div className="flex gap-2 text-xs">
                <div className="text-xs text-v1-content-secondary">
                  Streak Ends:
                </div>
                <div>{dayjs(nextDayEndTimestamp).fromNow(true)}</div>
              </div>
            </StatusChip>
          )}
        </div>
        <div className="flex items-center justify-center">
          <video
            className="absolute ml-px mt-1 h-52 w-52 object-cover opacity-40 mix-blend-multiply"
            autoPlay
            playsInline
            loop
            muted
          >
            <source src={video} />
          </video>
          <DailyProgress countdown={false} />
        </div>
      </div>
      <DrawerModal
        open={open}
        onClose={() => setOpen(false)}
        maskClosable={true}
        closeIcon={null}
      >
        <div className="mb-20 flex flex-col items-center">
          <h1 className="-mt-5 text-center font-bold">Daily Trade Quest</h1>
          <ul className="mt-6 ps-4 [&>li]:mb-2 [&>li]:list-disc [&>li]:text-sm [&>p]:mb-3 [&>p]:text-xs [&>p]:text-v1-content-secondary">
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
          <div className="mt-4 w-full rounded-2xl bg-v1-surface-l5 p-4">
            <h2>My Status:</h2>
            <p className="mb-6 mt-2 text-v1-content-secondary">
              Complete today&apos;s trade to keep your streak!
            </p>
            <div className="flex gap-3">
              <div className="basis-1/2">
                {Array.from({ length: 7 }, (_, i) => i).map(index => (
                  <div
                    key={index}
                    className="mb-2 flex items-center justify-between rounded-lg bg-v1-surface-l6 p-2 text-xs"
                  >
                    <span>Day {index + 1}</span>
                    <StatusBadge statusValue={dayStatus(index) || 'active'} />
                  </div>
                ))}
              </div>
              <div className="basis-1/2">
                <DailyProgress
                  className="flex items-center justify-center gap-2 text-xs"
                  countdown={true}
                />
                <hr className="my-3 border-v1-border-disabled" />
                <div className="relative mb-4 flex flex-col items-center overflow-hidden rounded-2xl bg-v1-surface-l2 p-3">
                  <h2>Special Reward</h2>
                  <Bg className="absolute top-0 h-full" />
                  <Stars className="absolute" />
                  <img src={box} className="my-4 h-16 w-16" alt="box" />
                  <Button
                    size="xs"
                    variant="primary"
                    className="relative w-full"
                    disabled={!completedAll}
                    onClick={claim}
                  >
                    {completedAll ? 'Claim' : <Lock />}
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <Button
            variant="primary"
            className="!absolute bottom-6 end-4 start-4 z-10"
            onClick={() => {
              setOpen(false);
              navigate('/');
            }}
          >
            Trade Now
            <Arrow className="ml-2" />
          </Button>
          <div className="pointer-events-none absolute bottom-0 end-0 start-0 h-32 w-full  bg-gradient-to-b from-[rgba(5,1,9,0.00)] from-0% to-v1-surface-l4/80 to-75%"></div>
        </div>
      </DrawerModal>
      <RewardModal open={openReward} onClose={() => setOpenReward(false)} />
    </>
  );
}
