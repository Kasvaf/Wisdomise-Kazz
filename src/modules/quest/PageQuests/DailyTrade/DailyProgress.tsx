import { Progress } from 'antd';
import { clsx } from 'clsx';
import { useGamification } from 'api/gamification';
import Countdown from 'modules/account/PageToken/Airdrop/Countdown';
import { ReactComponent as CheckIcon } from './images/check.svg';
import light from './images/light.png';

export default function DailyProgress({
  className,
  countdown,
}: {
  className?: string;
  countdown?: boolean;
}) {
  const {
    activeDay,
    currentDay,
    completedToday,
    completedAll,
    nextDayEndTimestamp,
  } = useGamification();

  return (
    <div className={clsx(className, 'flex items-center justify-center')}>
      <div className="relative flex flex-col items-center justify-center gap-2">
        <Progress
          className="[&>.ant-progress-inner]:bg-transparent"
          size={countdown ? 60 : 90}
          type="circle"
          steps={7}
          trailColor="rgba(0, 0, 0, 0.3)"
          percent={((currentDay + 1) * 100) / 7}
          showInfo={false}
        />
        {completedAll && (
          <img
            src={light}
            className="absolute h-full w-full rounded-full p-2 opacity-10"
            alt=""
          />
        )}
        <div
          className={clsx(
            'absolute flex flex-col items-center gap-2',
            completedToday && 'text-v1-content-positive',
          )}
        >
          {completedToday && <CheckIcon />}
          {!completedAll && `Day ${activeDay + 1}`}
        </div>
      </div>
      {currentDay > -1 && !completedAll && !completedToday && countdown && (
        <div
          className={clsx('flex flex-col text-center', !countdown && 'mt-2')}
        >
          <div className="text-xs text-v1-content-secondary">Streak Ends:</div>
          <Countdown deadline={nextDayEndTimestamp} />
        </div>
      )}
    </div>
  );
}
