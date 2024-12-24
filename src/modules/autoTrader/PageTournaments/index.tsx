import { Link } from 'react-router-dom';
import PageWrapper from 'modules/base/PageWrapper';
import { useTournaments } from 'api/tournament';
import TournamentCard from 'modules/autoTrader/PageTournaments/TournamentCard';

export default function PageTournaments() {
  const { data: tournaments, isLoading } = useTournaments();

  return (
    <PageWrapper loading={isLoading}>
      {tournaments?.map(tournament => (
        <Link key={tournament.key} to={tournament.key}>
          <TournamentCard tournament={tournament} />
        </Link>
      ))}
    </PageWrapper>
  );
}
