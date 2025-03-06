import { NavLink } from 'react-router-dom';
import { useTournaments } from 'api/tournament';
import { StatusChip } from 'modules/quest/PageQuests/StatusChip';
import leaderboard from './leaderboard.png';
import bg from './bg.png';
import gradient from './gradient.png';

const Tournaments = () => {
  const { data: tournaments } = useTournaments();

  const liveTournamentsCount = tournaments?.filter(t => t.status === 'live')
    .length;

  return (
    <NavLink
      to="tournaments"
      className="relative mb-4 flex items-center justify-between overflow-hidden rounded-2xl bg-v1-surface-l2 p-4 pr-0"
    >
      <img src={bg} alt="" className="absolute left-0 w-full" />
      <img src={gradient} alt="" className="absolute left-0 w-full" />
      <div className="relative">
        <h2 className="text-xl font-semibold">Tournament</h2>
        <p className="mt-3 max-w-52 text-xs text-v1-content-secondary">
          Compete in Tournaments and Climb the Leaderboard.
        </p>
        <StatusChip className="mt-3">
          <div className="text-xs text-v1-content-secondary ">
            Live Tournaments
            <span className="ml-3 text-v1-content-primary">
              {liveTournamentsCount}
            </span>
          </div>
        </StatusChip>
      </div>
      <img src={leaderboard} alt="" className="relative -mb-8 h-32 w-32" />
    </NavLink>
  );
};

export default Tournaments;
