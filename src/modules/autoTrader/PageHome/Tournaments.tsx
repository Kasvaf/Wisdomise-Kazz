import { Link } from 'react-router-dom';
import { useHasFlag } from 'api';
import { useTournaments } from 'api/tournament';
import TournamentCard from 'modules/autoTrader/PageTournaments/TournamentCard';
import { DebugPin } from 'shared/DebugPin';

const Tournaments = () => {
  const hasFlag = useHasFlag();
  const { data: tournaments } = useTournaments();
  if (!hasFlag('/trader-tournaments')) return null;

  return (
    <>
      <h1 className="mb-4">
        <DebugPin value="/trader-tournaments" />
        Tournaments
      </h1>
      <div className="-mx-4 mb-3 flex gap-4 overflow-auto px-4">
        {(tournaments || [])?.map(t => (
          <Link
            className="block"
            to={`/trader-tournaments/${t.key}`}
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
