import { Link } from 'react-router-dom';
import { useTournaments } from 'api/tournament';
import TournamentCard from 'modules/autoTrader/PageQuests/PageTournaments/TournamentCard';
import BtnBack from 'modules/base/BtnBack';

const Tournaments = () => {
  const { data: tournaments } = useTournaments();

  return (
    <>
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="w-1/2">
          <BtnBack />
        </div>
        <div className="shrink-0 text-center text-base font-medium">
          Tournaments
        </div>
        <div className="w-1/2"></div>
      </div>
      <div>
        {(tournaments || [])?.map(t => (
          <Link
            className="block snap-center"
            to={`/trader-quests/tournaments/${t.key}`}
            key={t.key}
          >
            <TournamentCard
              className="h-full min-w-[80vw]"
              key={t.key}
              tournament={t}
            />
          </Link>
        ))}
      </div>
    </>
  );
};

export default Tournaments;
