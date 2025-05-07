import { clsx } from 'clsx';
import { NavLink } from 'react-router-dom';
import { useTournaments } from 'api/tournament';
import { StatusChip } from 'modules/quest/PageQuests/StatusChip';
import leaderboard from './leaderboard.png';
import gradient from './gradient.png';

const Tournaments: React.FC<{ className?: string }> = ({ className }) => {
  const { data: tournaments } = useTournaments();

  const liveTournamentsCount = tournaments?.filter(t => t.status === 'live')
    .length;

  return (
    <NavLink
      to="tournaments"
      className={clsx(
        'relative flex items-center justify-between overflow-hidden rounded-2xl bg-v1-surface-l2 p-4 pr-0 md:h-[13rem]',
        'hover:saturate-200',
        className,
      )}
    >
      <img src={gradient} alt="" className="absolute left-0 w-full" />
      <div className="relative flex h-full flex-col justify-between">
        <div>
          <h2 className="text-xl font-semibold">Tournament</h2>
          <p className="mt-4 text-xs text-v1-content-secondary mobile:mt-2 mobile:max-w-52">
            Compete in Tournaments and Climb the Leaderboard.
          </p>
        </div>
        <StatusChip className="mt-4">
          <div className="text-xxs text-v1-content-secondary ">
            Live Tournaments
            <span className="ml-3 text-v1-content-primary">
              {liveTournamentsCount}
            </span>
          </div>
        </StatusChip>
      </div>
      <img
        src={leaderboard}
        alt=""
        className="relative -mb-8 size-48 mobile:size-32"
      />
    </NavLink>
  );
};

export default Tournaments;
