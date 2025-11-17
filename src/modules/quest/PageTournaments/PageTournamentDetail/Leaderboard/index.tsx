import type { LeaderboardParticipant, PromotionStatus } from 'api/tournament';
import { clsx } from 'clsx';
import { formatNumber } from 'utils/numbers';
import { ReactComponent as IconUser } from '../user.svg';
import { ReactComponent as Champion } from './champion.svg';
import { ReactComponent as ChampionBg } from './champion-bg.svg';
import { ReactComponent as Demoting } from './demoting.svg';
import { ReactComponent as DemotingBg } from './demoting-bg.svg';
import { ReactComponent as DemotionZone } from './demotion-zone.svg';
import { ReactComponent as Money } from './money.svg';
import { ReactComponent as MoneyBg } from './money-bg.svg';
import { ReactComponent as Neutral } from './neutral.svg';
import { ReactComponent as NeutralBg } from './neutral-bg.svg';
import { ReactComponent as Promoting } from './promoting.svg';
import { ReactComponent as PromotingBg } from './promoting-bg.svg';
import { ReactComponent as PromotionZone } from './promotion-zone.svg';

export default function Leaderboard({
  participants,
  me,
  isTopLevel,
  rewardedUsersMinRank,
}: {
  participants?: LeaderboardParticipant[];
  me?: LeaderboardParticipant;
  isTopLevel?: boolean;
  rewardedUsersMinRank?: number;
}) {
  return (
    <div className="mb-16 rounded-xl bg-v1-surface-l1 p-3">
      <div className="mb-2 flex gap-3 border-v1-border-primary/20 border-b px-3 pb-2 text-v1-content-secondary text-xs">
        <div>Rank</div>
        <div>Username</div>
        <div className="ml-auto">Trade Vol</div>
        {participants?.[0]?.promotion_status && <div>Status</div>}
      </div>
      {participants?.map((p, index) => (
        <LeaderboardItem
          hasLabel={
            index === 0 ||
            participants[index].promotion_status !==
              participants[index - 1].promotion_status
          }
          hasReward={
            !!p.trading_volume && p.rank <= (rewardedUsersMinRank ?? 0)
          }
          isTopLevel={isTopLevel}
          key={p.investor_key}
          participant={p}
        />
      ))}
      {me && (
        <LeaderboardItem
          className="fixed start-0 end-0 bottom-16 mobile:mx-12 mx-24 ml-[calc(var(--side-menu-width)+6rem)] mobile:block hidden border border-v1-border-primary/40"
          isTopLevel={isTopLevel}
          participant={me}
        />
      )}
    </div>
  );
}

const statusDetails: Record<PromotionStatus | 'CHAMPION', any> = {
  DEMOTING: {
    label: (
      <div className="flex items-center text-v1-content-negative">
        <span>Demotion Zone</span>
        <DemotionZone />
      </div>
    ),
    userStatus: (
      <div className="flex items-center justify-center">
        <DemotingBg className="absolute p-1" />
        <Demoting />
      </div>
    ),
    className: 'from-v1-background-negative',
  },
  NEUTRAL: {
    label: <span>Neutral Zone</span>,
    className: 'from-v1-surface-l4',
    userStatus: (
      <div className="flex items-center justify-center">
        <NeutralBg className="absolute p-1" />
        <Neutral />
      </div>
    ),
  },
  PROMOTING: {
    label: (
      <div className="flex items-center text-v1-content-positive">
        <span>Promotion Zone</span>
        <PromotionZone />
      </div>
    ),
    userStatus: (
      <div className="flex items-center justify-center">
        <PromotingBg className="absolute p-1" />
        <Promoting />
      </div>
    ),
    className: 'from-v1-background-positive',
  },
  CHAMPION: {
    label: <div className="text-v1-content-notice-bold">Hall of Champions</div>,
    userStatus: (
      <div className="flex items-center justify-center">
        <ChampionBg className="absolute p-1" />
        <Champion />
      </div>
    ),
    className: '!from-v1-content-notice-bold',
  },
};

export function LeaderboardItem({
  participant,
  hasLabel,
  isTopLevel,
  hasReward,
  className,
}: {
  participant: LeaderboardParticipant;
  hasLabel?: boolean;
  isTopLevel?: boolean;
  hasReward?: boolean;
  className?: string;
}) {
  const isChampion = isTopLevel && participant.promotion_status === 'PROMOTING';

  return (
    <>
      {participant.promotion_status && hasLabel && (
        <div className="mt-4 mb-2 ml-3 text-xxs">
          {
            statusDetails[
              isChampion ? 'CHAMPION' : participant.promotion_status
            ].label
          }
        </div>
      )}
      <div
        className={clsx(
          className,
          participant.promotion_status &&
            statusDetails[
              isChampion ? 'CHAMPION' : participant.promotion_status
            ].className,
          'mb-2 h-12 rounded-xl bg-gradient-to-l to-v1-surface-l2 p-[0.5px]',
        )}
      >
        <div className="flex h-full items-center justify-between rounded-xl bg-v1-surface-l2/90 px-3 text-xs">
          <div className="w-6 shrink-0">
            {participant.trading_volume > 0 ? participant.rank : '-'}
          </div>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-v1-surface-l4">
            <IconUser />
          </div>
          <div className="mx-3 truncate">
            {participant.name ?? participant.investor_key}
          </div>
          <div className="ms-auto">
            $
            {formatNumber(participant.trading_volume, {
              compactInteger: false,
              separateByComma: false,
              decimalLength: 1,
              minifyDecimalRepeats: false,
            })}
          </div>
          {participant.promotion_status && (
            <div className="mr-2 ml-4 flex items-center">
              {hasReward && (
                <>
                  <Money className="-mr-1" />
                  <MoneyBg className="absolute right-24" />
                </>
              )}
              {
                statusDetails[
                  isChampion ? 'CHAMPION' : participant.promotion_status
                ].userStatus
              }
            </div>
          )}
        </div>
      </div>
    </>
  );
}
