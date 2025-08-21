import { Progress } from 'antd';
import { useGamification } from 'api/gamification';
import { clsx } from 'clsx';
import Countdown from 'modules/quest/PageQuests/DailyTrade/Countdown';
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
          percent={((currentDay + 1) * 100) / 7}
          showInfo={false}
          size={countdown ? 60 : 90}
          steps={7}
          trailColor="rgba(0, 0, 0, 0.3)"
          type="circle"
        />
        {completedAll && (
          <img
            alt=""
            className="absolute size-full rounded-full p-2 opacity-10"
            src={light}
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
          <div className="text-v1-content-secondary text-xs">Streak Ends:</div>
          <Countdown deadline={nextDayEndTimestamp} />
        </div>
      )}
    </div>
  );
}
