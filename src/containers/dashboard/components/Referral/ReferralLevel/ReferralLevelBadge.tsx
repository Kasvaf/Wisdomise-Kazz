import type { FC } from 'react';
import classNames from 'classnames';

interface ReferralLevelBadgeProps {
  claimed: boolean;
  level: number;
  progress?: number;
  className?: string;
}

const ReferralLevelBadge: FC<ReferralLevelBadgeProps> = ({
  claimed,
  level,
  progress = 0,
  className,
}) => {
  // https://blog.logrocket.com/build-svg-circular-progress-component-react-hooks/
  const size = 64;
  const strokeWidth = 2;
  const center = size / 2;
  const radius = center - strokeWidth;
  const arcLength = 2 * Math.PI * radius;
  const arcOffset = arcLength * ((100 - progress) / 100);

  return (
    <div className={classNames('rl-container', className)}>
      <div className="z-1 absolute grid h-full w-full place-items-center rounded-full">
        <svg className="rl-progress">
          <circle
            stroke="url(#gradient)"
            cx={center}
            cy={center}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={arcLength}
            strokeDashoffset={arcOffset}
            fill="transparent"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#13dff2" />
              <stop offset="100%" stopColor="#e26cff" />
            </linearGradient>
          </defs>
        </svg>
        <div className="h-full w-full rounded-full bg-bgcolor"></div>
      </div>
      <div
        className={classNames(
          'z-2 absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center bg-cover bg-center bg-no-repeat',
          {
            'rl-icon-circle-active': level === 1 && claimed,
            'rl-icon-circle opacity-50': level === 1 && !claimed,
            'rl-icon-hexagon-active': level === 2 && claimed,
            'rl-icon-hexagon opacity-50': level === 2 && !claimed,
            'rl-icon-diamond-active': level === 3 && claimed,
            'rl-icon-diamond opacity-50': level === 3 && !claimed,
          },
        )}
      ></div>
      <span className="relative z-10 text-xl font-semibold text-white">
        {level}
      </span>
    </div>
  );
};

export default ReferralLevelBadge;
