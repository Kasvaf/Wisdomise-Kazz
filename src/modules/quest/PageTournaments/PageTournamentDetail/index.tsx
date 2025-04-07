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
import Leaderboard, {
  LeaderboardItem,
} from 'modules/quest/PageTournaments/PageTournamentDetail/Leaderboard';

export default function PageTournamentDetail() {
  const { id } = useParams<{ id: string }>();
  if (!id) throw new Error('unexpected');

  const { data: tournament, isLoading } = useTournamentQuery(id);
  const { data: me } = useTournamentProfileQuery(id);
  const { data: participants } = useTournamentLeaderboardQuery(id);

  return (
    <TournamentsOnboarding>
      <PageWrapper loading={isLoading}>
        <div className="grid grid-cols-2 items-start gap-4 pb-10 mobile:grid-cols-1">
          <div>
            {tournament && (
              <TournamentCard tournament={tournament} hasDetail={true} />
            )}
            {me && (
              <div className="mt-3 rounded-xl bg-v1-surface-l2 p-3 mobile:hidden">
                <h2 className="mb-2">My Status</h2>
                <LeaderboardItem participant={me} />
              </div>
            )}
          </div>

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
        </div>
      </PageWrapper>
    </TournamentsOnboarding>
  );
}
