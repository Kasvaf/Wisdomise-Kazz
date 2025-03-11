import { useParams } from 'react-router-dom';
import {
  useTournamentQuery,
  useTournamentLeaderboardQuery,
  useTournamentProfileQuery,
} from 'api/tournament';
import TournamentCard from 'modules/quest/PageTournaments/TournamentCard';
import PageWrapper from 'modules/base/PageWrapper';
import empty from 'modules/autoTrader/PagePositions/PositionsList/empty.svg';
import TournamentsOnboarding from 'modules/quest/PageTournaments/TournamentsOnboarding';
import BtnBack from 'modules/base/BtnBack';
import Leaderboard from 'modules/quest/PageTournaments/PageTournamentDetail/Leaderboard';

export default function PageTournamentDetail() {
  const { id } = useParams<{ id: string }>();
  if (!id) throw new Error('unexpected');

  const { data: tournament, isLoading } = useTournamentQuery(id);
  const { data: me } = useTournamentProfileQuery(id);
  const { data: participants } = useTournamentLeaderboardQuery(id);

  return (
    <TournamentsOnboarding>
      <PageWrapper loading={isLoading} className="pb-10">
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="w-1/2">
            <BtnBack />
          </div>
          <div className="shrink-0 text-center text-base font-medium">
            {tournament?.name}
          </div>
          <div className="w-1/2"></div>
        </div>
        {tournament && (
          <TournamentCard tournament={tournament} hasDetail={true} />
        )}

        {tournament?.status === 'upcoming' && (
          <div className="flex flex-col items-center justify-center pb-5 text-center">
            <img src={empty} alt="" className="my-8" />
            <h1 className="mt-3 font-semibold">Trading Leaderboard</h1>

            <p className="mt-3 w-3/4 text-xs">
              The tournament hasn’t launched yet. Stay tuned and get ready to
              secure your spot among the stars!
            </p>
          </div>
        )}
        <Leaderboard participants={participants} me={me} />
      </PageWrapper>
    </TournamentsOnboarding>
  );
}
