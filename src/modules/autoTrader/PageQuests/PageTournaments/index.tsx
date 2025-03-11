import { Link } from 'react-router-dom';
import { useTournaments } from 'api/tournament';
import TournamentCard from 'modules/autoTrader/PageQuests/PageTournaments/TournamentCard';
import BtnBack from 'modules/base/BtnBack';

const Tournaments = () => {
  const { data: tournaments } = useTournaments();

  return (
    <>
      <div className="mb-3 flex items-center gap-2">
        <BtnBack />
        <div className="shrink-0 text-center text-base font-medium">
          Tournaments
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6 mobile:grid-cols-1">
        {(tournaments || [])?.map(t => (
          <Link
            className="block snap-center hover:saturate-200"
            to={`/trader-quests/tournaments/${t.key}`}
            key={t.key}
          >
            <TournamentCard
              className="h-full mobile:min-w-[80vw]"
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
