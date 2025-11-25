import { clsx } from 'clsx';
import { StatusChip } from 'modules/quest/PageQuests/StatusChip';
import { NavLink } from 'react-router-dom';
import { useTournaments } from 'services/rest/tournament';
import gradient from './gradient.png';
import leaderboard from './leaderboard.png';

const Tournaments: React.FC<{ className?: string }> = ({ className }) => {
  const { data: tournaments } = useTournaments();

  const liveTournamentsCount = tournaments?.filter(
    t => t.status === 'live',
  ).length;

  return (
    <NavLink
      className={clsx(
        'relative flex items-center justify-between overflow-hidden rounded-2xl bg-v1-surface-l2 p-4 pr-0 md:h-[13rem]',
        'hover:saturate-200',
        className,
      )}
      to="tournaments"
    >
      <img alt="" className="absolute left-0 w-full" src={gradient} />
      <div className="relative flex h-full flex-col justify-between">
        <div>
          <h2 className="font-semibold text-xl">Tournament</h2>
          <p className="mobile:mt-2 mt-4 mobile:max-w-52 text-v1-content-secondary text-xs">
            Compete in Tournaments and Climb the Leaderboard.
          </p>
        </div>
        <StatusChip className="mt-4">
          <div className="text-v1-content-secondary text-xxs">
            Live Tournaments
            <span className="ml-3 text-v1-content-primary">
              {liveTournamentsCount}
            </span>
          </div>
        </StatusChip>
      </div>
      <img
        alt=""
        className="-mb-8 relative mobile:size-32 size-48"
        src={leaderboard}
      />
    </NavLink>
  );
};

export default Tournaments;
