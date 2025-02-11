import { useParams } from 'react-router-dom';
import { useMemo } from 'react';
import {
  type TournamentParticipant,
  useTournament,
  useTournamentLeaderboard,
  useTournamentMe,
} from 'api/tournament';
import TournamentCard from 'modules/autoTrader/PageQuests/TournamentCard';
import PageWrapper from 'modules/base/PageWrapper';
import { addComma } from 'utils/numbers';
import empty from 'modules/autoTrader/PositionsList/empty.svg';
import { useTelegramProfile } from 'modules/base/mini-app/TelegramProvider';
import TournamentsOnboarding from 'modules/autoTrader/PageQuests/TournamentsOnboarding';
import { ReactComponent as IconUser } from './user.svg';

const PARTICIPANTS_COUNT = 50;

export default function PageTournamentDetail() {
  const { id } = useParams<{ id: string }>();
  if (!id) throw new Error('unexpected');

  const { data: tournament, isLoading } = useTournament(id);
  const { data: me } = useTournamentMe(id);
  const { data: participants } = useTournamentLeaderboard(id);
  const profile = useTelegramProfile();

  const sortedParticipants = useMemo(() => {
    let sorted: TournamentParticipant[] = [];
    if (participants && me) {
      sorted = [...participants];
      const myIndex = sorted.findIndex(p => p.investor_key === me.investor_key);
      const lastParticipant = participants.at(-1);

      if (myIndex === -1) {
        if (
          lastParticipant &&
          me.trading_volume >= lastParticipant.trading_volume
        ) {
          sorted.push(me);
        }
      } else {
        sorted[myIndex] = me;
      }
      sorted.sort((p1, p2) => p2.trading_volume - p1.trading_volume);
      sorted = sorted.slice(0, PARTICIPANTS_COUNT);
      const myAfterSortIndex = sorted.findIndex(
        p => p.investor_key === me?.investor_key,
      );
      if (myAfterSortIndex !== -1) {
        me.rank = myAfterSortIndex + 1;
      }
    }

    return sorted;
  }, [me, participants]);

  return (
    <TournamentsOnboarding>
      <PageWrapper loading={isLoading}>
        {tournament && (
          <TournamentCard tournament={tournament} hasDetail={true} />
        )}
        <div className="mt-3 rounded-xl bg-v1-surface-l2 p-4 text-sm">
          <h1 className="mb-3">Leaderboard</h1>
          {tournament?.status === 'upcoming' ? (
            <div className="flex flex-col items-center justify-center pb-5 text-center">
              <img src={empty} alt="" className="my-8" />
              <h1 className="mt-3 font-semibold">Trading Leaderboard</h1>

              <p className="mt-3 w-3/4 text-xs">
                The tournament hasn’t launched yet. Stay tuned and get ready to
                secure your spot among the stars!
              </p>
            </div>
          ) : (
            <>
              <div className="mb-2 flex justify-between px-6 text-xs text-v1-content-secondary">
                <div>Rank</div>
                <div>Trade Vol</div>
              </div>
              {sortedParticipants?.map((p, index) => (
                <div
                  key={p.investor_key}
                  className="mb-2 flex h-12 items-center justify-between rounded-xl bg-v1-surface-l3 px-3"
                >
                  <div className="w-6 shrink-0">{index + 1}</div>
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-v1-surface-l4">
                    <IconUser />
                  </div>
                  <div className="mx-3 truncate">
                    {p.investor_key === me?.investor_key
                      ? profile?.first_name
                      : p.name ?? p.investor_key}
                  </div>
                  <div className="ms-auto">
                    ${addComma(Math.round(+p.trading_volume))}
                  </div>
                </div>
              ))}
              {me && (
                <div
                  className="fixed bottom-12 end-0 start-0 rounded-xl px-12"
                  style={{
                    background:
                      'linear-gradient(0deg, rgba(20, 20, 20, 0.3) 50%, rgba(19, 25, 32, 0.00) 100%)',
                  }}
                >
                  <div
                    className="mb-8 flex h-12 items-center justify-between rounded-xl  bg-v1-border-inverse px-3"
                    style={{
                      boxShadow:
                        '-90px 61px 30px 0px rgba(19, 25, 32, 0.00), -58px 39px 28px 0px rgba(19, 25, 32, 0.03), -33px 22px 24px 0px rgba(19, 25, 32, 0.09), -14px 10px 17px 0px rgba(19, 25, 32, 0.16), -4px 2px 10px 0px rgba(19, 25, 32, 0.18)',
                    }}
                  >
                    <div className="start-0 w-6">{me.rank}</div>
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-v1-surface-l4">
                      <IconUser />
                    </div>
                    <div className="mx-3 truncate">
                      {profile?.first_name ?? me.investor_key}
                    </div>
                    <div className="ms-auto">
                      ${addComma(Math.round(+(me.trading_volume ?? '0')))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </PageWrapper>
    </TournamentsOnboarding>
  );
}
