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
  const { details } = useLeague();

  const league = details?.find(l => l.slug === slug);

  return (
    <div className={clsx('flex items-center justify-center', className)}>
      {isActive && (
        <img
          src={light}
          alt=""
          className="absolute animate-[spin_5s_linear_infinite] rounded-full mix-blend-exclusion"
        />
      )}
      <img src={league?.image} alt="" className="relative" />
    </div>
  );
}
