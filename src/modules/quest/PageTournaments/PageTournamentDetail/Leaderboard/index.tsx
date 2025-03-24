import { clsx } from 'clsx';
import { useMemo } from 'react';
import {
  type LeaderboardParticipant,
  type PromotionStatus,
} from 'api/tournament';
import { addComma } from 'utils/numbers';
import { ReactComponent as IconUser } from '../user.svg';
import { ReactComponent as Demoting } from './demoting.svg';

export default function Leaderboard({
  participants,
  me,
}: {
  participants?: LeaderboardParticipant[];
  me?: LeaderboardParticipant;
}) {
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
    <div className="rounded-xl bg-v1-surface-l2 p-3">
      <div className="mb-2 flex gap-3 border-b border-v1-border-primary/20 px-3 pb-2 text-xs text-v1-content-secondary">
        <div>Rank</div>
        <div>Username</div>
        <div className="ml-auto">Trade Vol</div>
        {sortedParticipants[0]?.promotion_status && <div>Status</div>}
      </div>
      {sortedParticipants?.map((p, index) => (
        <LeaderboardItem
          key={p.investor_key}
          participant={p}
          rank={index + 1}
          hasLabel={
            index === 0 ||
            sortedParticipants[index].promotion_status !==
              sortedParticipants[index - 1].promotion_status
          }
        />
      ))}
      {me && (
        <div
          className="fixed bottom-4 end-0 start-0 mx-24 ml-[calc(var(--side-menu-width)+6rem)] rounded-xl border border-v1-border-primary/20 text-xs mobile:mx-12 mobile:ml-12"
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

const statusDetails: Record<PromotionStatus, any> = {
  DEMOTING: {
    label: (
      <div className="flex items-center gap-2 text-v1-content-negative">
        <span>Demotion Zone</span>
        <Demoting />
      </div>
    ),
    labelIcon: null,
    userStatus: null,
    className: 'from-v1-background-negative',
  },
  NEUTRAL: {
    label: <span>Neutral Zone</span>,
    className: 'from-v1-surface-l4',
  },
  PROMOTING: {
    label: (
      <div className="flex items-center gap-2 text-v1-content-positive">
        <span>Promotion Zone</span>
        <Demoting />
      </div>
    ),
    className: 'from-v1-background-positive',
  },
};

function LeaderboardItem({
  participant,
  rank,
  hasLabel,
}: {
  participant: LeaderboardParticipant;
  rank?: number;
  hasLabel?: boolean;
}) {
  return (
    <>
      {participant.promotion_status && hasLabel && (
        <div className="mb-2 ml-3 mt-4 text-xxs">
          {statusDetails[participant.promotion_status].label}
        </div>
      )}
      <div
        className={clsx(
          participant.promotion_status &&
            statusDetails[participant.promotion_status].className,
          'mb-2 h-12 rounded-xl bg-gradient-to-l to-v1-surface-l3 p-[0.5px]',
        )}
      >
        <div className="flex h-full items-center justify-between rounded-xl bg-v1-surface-l3/90 px-3 text-xs">
          <div className="w-6 shrink-0">{rank}</div>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-v1-surface-l4">
            <IconUser />
          </div>
          <div className="mx-3 truncate">
            {participant.name ?? participant.investor_key}
          </div>
          <div className="ms-auto">
            ${addComma(Math.round(+participant.trading_volume))}
          </div>
          <div></div>
        </div>
      </div>
    </>
  );
}
