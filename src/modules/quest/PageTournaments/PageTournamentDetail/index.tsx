import {
  useTournamentLeaderboardQuery,
  useTournamentProfileQuery,
  useTournamentQuery,
} from 'api/tournament';
import empty from 'modules/autoTrader/Positions/PositionsList/empty.svg';
import PageWrapper from 'modules/base/PageWrapper';
import Leaderboard, {
  LeaderboardItem,
} from 'modules/quest/PageTournaments/PageTournamentDetail/Leaderboard';
import TournamentResultModalContent from 'modules/quest/PageTournaments/PageTournamentDetail/TournamentResultModalContent';
import TournamentCard from 'modules/quest/PageTournaments/TournamentCard';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CoinExtensionsGroup } from 'shared/CoinExtensionsGroup';
import useModal from 'shared/useModal';
import useIsMobile from 'utils/useIsMobile';

export default function PageTournamentDetail() {
  const { id } = useParams<{ id: string }>();
  if (!id) throw new Error('unexpected');
  const isMobile = useIsMobile();

  const { data: tournament, isLoading } = useTournamentQuery(id);
  const { data: me } = useTournamentProfileQuery(id);
  const { data: participants } = useTournamentLeaderboardQuery(id);
  const [tournamentResultModal, openTournamentResultModal] = useModal(
    TournamentResultModalContent,
    {
      closable: false,
      maskClosable: false,
      mobileDrawer: true,
      className:
        '[&>.ant-drawer-wrapper-body]:!bg-v1-surface-l1 [&>.ant-modal-content]:!bg-v1-surface-l1',
    },
  );

  useEffect(() => {
    if (
      me?.result &&
      tournament?.key &&
      !me.result.is_claimed &&
      me.result.reward_items.length > 0
    ) {
      void openTournamentResultModal({ tournamentKey: tournament.key });
    }
  }, [me, openTournamentResultModal, tournament?.key]);

  return (
    <PageWrapper
      extension={!isMobile && <CoinExtensionsGroup />}
      footer={null}
      hasBack
      loading={isLoading}
      title={tournament?.name}
    >
      <div className="grid grid-cols-2 mobile:grid-cols-1 items-start gap-4">
        <div>
          {tournament && (
            <TournamentCard hasDetail={true} tournament={tournament} />
          )}
          {me && (
            <div className="mt-3 mobile:hidden rounded-xl bg-v1-surface-l2 p-3">
              <h2 className="mb-2">My Status</h2>
              <LeaderboardItem participant={me} />
            </div>
          )}
        </div>

        {tournament?.status === 'upcoming' && (
          <div className="flex flex-col items-center justify-center pb-5 text-center">
            <img alt="" className="my-8" src={empty} />
            <h1 className="mt-3 font-semibold">Trading Leaderboard</h1>

            <p className="mt-3 w-3/4 text-xs">
              The tournament hasn’t launched yet. Stay tuned and get ready to
              secure your spot among the stars!
            </p>
          </div>
        )}
        <Leaderboard me={me} participants={participants} />
      </div>
      {tournamentResultModal}
    </PageWrapper>
  );
}
