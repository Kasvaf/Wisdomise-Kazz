import { Progress } from 'antd';
import { clsx } from 'clsx';
import { useGamification } from 'api/gamification';
import { ReactComponent as CheckIcon } from './check.svg';

export default function DailyProgress() {
  const { activeDay, currentDay, completedToday } = useGamification();

  return (
    <div className="relative flex items-center justify-center gap-2">
      <Progress
        size={80}
        type="circle"
        steps={7}
        percent={(currentDay * 100) / 7}
        trailColor="rgba(0, 0, 0, 0.06)"
        showInfo={false}
      />
      <div
        className={clsx(
          'absolute flex flex-col items-center gap-2',
          completedToday && 'text-v1-content-positive',
        )}
      >
        {completedToday && <CheckIcon />}
        Day {activeDay + 1}
      </div>
    </div>
  );
}
