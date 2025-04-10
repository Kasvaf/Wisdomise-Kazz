import { Link } from 'react-router-dom';
import { useTournaments } from 'api/tournament';
import PageWrapper from 'modules/base/PageWrapper';
import TournamentCard from 'modules/quest/PageTournaments/TournamentCard';

const Tournaments = () => {
  const { data: tournaments } = useTournaments();

  return (
    <PageWrapper hasBack title="Tournaments">
      <div className="grid grid-cols-2 gap-6 mobile:grid-cols-1">
        {(tournaments || [])?.map(t => (
          <Link
            className="block snap-center hover:saturate-200"
            to={`/trader/quests/tournaments/${t.key}`}
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
    </PageWrapper>
  );
};

export default Tournaments;
