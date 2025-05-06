import { useState } from 'react';
import { clsx } from 'clsx';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { bxChevronRight } from 'boxicons-quasar';
import DailyProgress from 'modules/quest/PageQuests/DailyTrade/DailyProgress';
import { DrawerModal } from 'shared/DrawerModal';
import {
  useGamification,
  useGamificationActionMutation,
  useGamificationProfileQuery,
} from 'api/gamification';
import { StatusBadge } from 'modules/quest/PageTournaments/TournamentCard';
import { StatusChip } from 'modules/quest/PageQuests/StatusChip';
import { Button } from 'shared/v1-components/Button';
import video from 'modules/quest/PageQuests/DailyTrade/images/video.webm';
import useRewardModal from 'modules/account/PageRewards/RewardModal/useRewardModal';
import Icon from 'shared/Icon';
import box from './images/box.png';
import bg from './images/bg.png';
import { ReactComponent as Stars } from './images/stars.svg';
import { ReactComponent as Arrow } from './images/arrow.svg';
// eslint-disable-next-line import/max-dependencies
import { ReactComponent as Lock } from './images/lock.svg';

export default function DailyTrade({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [RewardModal, openRewardModal] = useRewardModal();
  const [rewardAmount, setRewardAmount] = useState(0);
  const {
    activeDay,
    currentDay,
    completedToday,
    completedAll,
    rewardClaimed,
    nextDayEndTimestamp,
    setRewardClaimed,
  } = useGamification();
  const { data } = useGamificationProfileQuery();
  const { mutateAsync } = useGamificationActionMutation();
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
    if (data?.profile.customAttributes.boxRewardAmount) {
      setRewardAmount(+data.profile.customAttributes.boxRewardAmount);
    }
    void mutateAsync({ event_name: 'claim' }).then(() => {
      setOpen(false);
      setRewardClaimed(true);
      return openRewardModal({ amount: rewardAmount });
    });
  };

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className={clsx(
          'relative flex items-center justify-between overflow-hidden rounded-2xl bg-v1-surface-l2 p-4 md:h-[13rem]',
          'cursor-pointer hover:saturate-200',
          className,
        )}
      >
        <img src={bg} className="absolute right-0 top-0 h-full" alt="" />
        <div className="relative flex h-full flex-col justify-between">
          <div>
            <h2 className="text-xl font-semibold">Daily Trade</h2>
            <p className="mt-4 text-xs text-v1-content-secondary mobile:mt-2 mobile:max-w-48">
              Complete Trades Daily and Earn Rewards.
            </p>
          </div>

          {!completedToday && (
            <button
              className={clsx(
                'my-5 flex items-center text-xs',
                completedAll && rewardClaimed && 'hidden',
              )}
            >
              {completedAll ? 'Claim Your Reward' : "Start Today's Trade"}
              <Icon name={bxChevronRight} />
            </button>
          )}
          {currentDay > -1 && !completedToday && !completedAll && (
            <StatusChip className="mt-3">
              <div className="flex gap-2 text-xs">
                <div className="text-xxs text-v1-content-secondary">
                  Streak Ends:
                </div>
                <div>{dayjs(nextDayEndTimestamp).fromNow(true)}</div>
              </div>
            </StatusChip>
          )}
        </div>
        <div className="flex items-center justify-center md:mr-2">
          <video
            className="absolute ml-px mt-1 size-60 object-cover opacity-30 mix-blend-multiply"
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
      {RewardModal}
    </>
  );
}
