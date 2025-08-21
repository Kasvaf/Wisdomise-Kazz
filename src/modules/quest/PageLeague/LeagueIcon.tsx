import { clsx } from 'clsx';
import useLeague from 'modules/quest/PageLeague/useLeague';
import light from './images/light.png';

export default function LeagueIcon({
  slug,
  isActive,
  className,
}: {
  slug: string;
  isActive?: boolean;
  className?: string;
}) {
  const { league } = useLeague();

  const leagueDetail = league.details?.find(l => l.slug === slug);

  return (
    <div className={clsx('flex items-center justify-center', className)}>
      {isActive && (
        <img
          alt=""
          className="absolute w-40 animate-[spin_5s_linear_infinite] rounded-full mix-blend-exclusion"
          src={light}
        />
      )}
      <img alt="" className="relative h-full" src={leagueDetail?.image} />
    </div>
  );
}
