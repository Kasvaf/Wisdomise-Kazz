import PageWrapper from 'modules/base/PageWrapper';
import TournamentCard from 'modules/quest/PageTournaments/TournamentCard';
import { Link } from 'react-router-dom';
import { useTournaments } from 'services/rest/tournament';
import { CoinExtensionsGroup } from 'shared/CoinExtensionsGroup';
import useIsMobile from 'utils/useIsMobile';

const Tournaments = () => {
  const { data: tournaments } = useTournaments();
  const isMobile = useIsMobile();

  return (
    <PageWrapper
      extension={!isMobile && <CoinExtensionsGroup />}
      hasBack
      title="Tournaments"
    >
      <div className="grid grid-cols-2 mobile:grid-cols-1 gap-4">
        {(tournaments || [])?.map(t => (
          <Link
            className="block snap-center hover:saturate-200"
            key={t.key}
            to={`/trader/quests/tournaments/${t.key}`}
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
