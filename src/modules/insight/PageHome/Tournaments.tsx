import { Link } from 'react-router-dom';
import { useTournaments } from 'api/tournament';
import TournamentCard from 'modules/autoTrader/PageQuests/TournamentCard';

const Tournaments = () => {
  const { data: tournaments } = useTournaments();

  return (
    <>
      <h1 className="mb-4">Tournaments</h1>
      <div className="-mx-3 mb-3 flex gap-4 overflow-auto px-4">
        {(tournaments || [])?.map(t => (
          <Link
            className="block"
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
