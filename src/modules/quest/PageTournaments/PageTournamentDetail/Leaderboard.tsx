import { clsx } from 'clsx';
import { useMemo } from 'react';
import { type LeaderboardParticipant } from 'api/tournament';
import { addComma } from 'utils/numbers';
import { useIsTrialBannerVisible } from 'modules/base/Container/TrialEndBanner';
import { ReactComponent as IconUser } from './user.svg';

export default function Leaderboard({
  participants,
  me,
}: {
  participants: LeaderboardParticipant[];
  me: LeaderboardParticipant;
}) {
  const isTrialBannerVisible = useIsTrialBannerVisible();
  const sortedParticipants = useMemo(() => {
    let sorted: LeaderboardParticipant[] = [];
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
      sorted = sorted.slice(0, participants.length);
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
    <div>
      <div className="mb-2 flex gap-3 border-b border-v1-border-primary/20 px-3 py-2 text-xs text-v1-content-secondary">
        <div>Rank</div>
        <div>Username</div>
        <div className="ml-auto">Trade Vol</div>
        <div>Status</div>
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
          <div className="mx-3 truncate">{p.name ?? p.investor_key}</div>
          <div className="ms-auto">
            ${addComma(Math.round(+p.trading_volume))}
          </div>
        </div>
      ))}
      {me && (
        <div
          className={clsx(
            'fixed end-0 start-0 rounded-xl px-12',
            isTrialBannerVisible ? 'bottom-28' : 'bottom-20',
          )}
          style={{
            background:
              'linear-gradient(0deg, rgba(20, 20, 20, 0.3) 50%, rgba(19, 25, 32, 0.00) 100%)',
          }}
        >
          <div
            className="flex h-12 items-center justify-between rounded-xl  bg-v1-border-inverse px-3"
            style={{
              boxShadow:
                '-90px 61px 30px 0px rgba(19, 25, 32, 0.00), -58px 39px 28px 0px rgba(19, 25, 32, 0.03), -33px 22px 24px 0px rgba(19, 25, 32, 0.09), -14px 10px 17px 0px rgba(19, 25, 32, 0.16), -4px 2px 10px 0px rgba(19, 25, 32, 0.18)',
            }}
          >
            <div className="start-0 w-6">{me.rank}</div>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-v1-surface-l4">
              <IconUser />
            </div>
            <div className="mx-3 truncate">{me.name ?? me.investor_key}</div>
            <div className="ms-auto">
              ${addComma(Math.round(+(me.trading_volume ?? '0')))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
