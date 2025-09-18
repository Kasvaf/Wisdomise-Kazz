import { Tooltip } from 'antd';
import { useSymbolInfo } from 'api/symbol';
import type {
  GamificationStatus,
  LeaderboardPrize,
  Tournament,
} from 'api/tournament';
import { bxInfoCircle } from 'boxicons-quasar';
import { clsx } from 'clsx';
import dayjs from 'dayjs';
import first from 'modules/quest/PageTournaments/images/1st.svg';
import second from 'modules/quest/PageTournaments/images/2nd.svg';
import third from 'modules/quest/PageTournaments/images/3rd.svg';
import cardBg from 'modules/quest/PageTournaments/images/card-bg.svg';
import cardBg1 from 'modules/quest/PageTournaments/images/card-bg-1.svg';
import cardBg2 from 'modules/quest/PageTournaments/images/card-bg-2.svg';
import live from 'modules/quest/PageTournaments/images/live.svg';
import snow from 'modules/quest/PageTournaments/images/snow.svg';
import { Fragment, useState } from 'react';
import { Coin } from 'shared/Coin';
import { DrawerModal } from 'shared/DrawerModal';
import Icon from 'shared/Icon';

const rankOrdinalNumber = (n: number) => {
  if (n % 100 >= 11 && n % 100 <= 13) {
    return `${n}th`;
  }
  switch (n % 10) {
    case 1: {
      return `${n}st`;
    }
    case 2: {
      return `${n}nd`;
    }
    case 3: {
      return `${n}rd`;
    }
    default: {
      return `${n}th`;
    }
  }
};

export default function TournamentCard({
  className,
  tournament,
  hasDetail,
}: {
  className?: string;
  tournament: Tournament;
  hasDetail?: boolean;
}) {
  const bgIndex = uuidToNumber(tournament.key);
  const bgSrc = bgIndex === 0 ? cardBg : bgIndex === 1 ? cardBg1 : cardBg2;

  return (
    <div
      className={clsx(
        'relative mb-3 block overflow-hidden rounded-xl bg-v1-surface-l2 p-4 pb-6 text-sm',
        className,
      )}
      key={tournament.key}
    >
      <img alt="" className="absolute end-0 bottom-0 h-full" src={bgSrc} />
      <img alt="" className="absolute end-0 bottom-0" src={snow} />
      <div className="relative">
        <div className="flex items-center gap-2">
          <img alt="stonfi" className="h-8 w-8" src={tournament.icon} />
          <div>
            <h2 className="text-sm">{tournament.name}</h2>
            <h1 className="text-v1-content-secondary text-xs">
              Trading Volume Contest
            </h1>
          </div>
          <div className="ms-auto">
            <StatusBadge statusValue={tournament.status} />
          </div>
        </div>
        <div className="my-3 whitespace-pre-line">
          {tournament.description}
          {hasDetail && tournament.tooltip_content && (
            <Tooltip title={tournament.tooltip_content}>
              <Icon
                className="ms-2 inline-block text-v1-content-secondary"
                name={bxInfoCircle}
                size={16}
              />
            </Tooltip>
          )}
        </div>
        <hr className="border-white/5" />
        <div className="mt-3 flex justify-between gap-4">
          <div className="shrink-0 text-v1-content-secondary">Prize Pool</div>
          <LeaderboardPrizes hasDetail={hasDetail} prizes={tournament.prizes} />
        </div>
        <div className="mt-3 flex items-center justify-between">
          {tournament.status === 'live' ? (
            <CountdownBar
              endDate={tournament.end_time}
              startDate={tournament.start_time}
            />
          ) : tournament.status === 'upcoming' ? (
            <>
              <div className="text-v1-content-secondary">Launch Date</div>
              <div>{new Date(tournament.start_time).toLocaleString()}</div>
            </>
          ) : (
            'The tournament is over, Congrats to the champions! 🚀'
          )}
        </div>
      </div>
    </div>
  );
}

function uuidToNumber(uuid: string) {
  let sum = 0;
  for (const char of uuid) {
    sum += char.codePointAt(0) ?? 0;
  }
  return sum % 3;
}

const TOURNAMENT_STATUS: Array<{
  value: GamificationStatus;
  name: string;
  className: string;
}> = [
  {
    value: 'live',
    name: 'Live',
    className: 'bg-v1-background-positive/10 text-v1-content-positive',
  },
  {
    value: 'upcoming',
    name: 'Upcoming',
    className: 'bg-v1-background-brand/10 text-v1-content-brand',
  },
  {
    value: 'finished',
    name: 'Finished',
    className: 'bg-v1-background-notice/10 text-v1-content-notice',
  },
  {
    value: 'active',
    name: 'Active',
    className: 'bg-v1-background-positive/10 text-v1-content-positive',
  },
];

export function StatusBadge({
  statusValue,
}: {
  statusValue: GamificationStatus;
}) {
  const status = TOURNAMENT_STATUS.find(s => s.value === statusValue);

  return (
    <div
      className={clsx(
        'flex h-5 items-center gap-2 rounded-3xl px-2 text-xs',
        status?.className,
      )}
    >
      {status?.name}
      {statusValue === 'live' && <img alt="" src={live} />}
    </div>
  );
}

function PrizeCoin({ slug, amount }: { slug: string; amount: number }) {
  const { data: coin } = useSymbolInfo({ slug });

  return coin ? (
    <div className="flex items-center">
      <Coin coin={coin} mini nonLink noText />
      <span>{amount}</span>
      <span className="ms-1">{coin.abbreviation}</span>
    </div>
  ) : null;
}

export function LeaderboardPrizes({
  prizes,
  hasDetail,
  description,
}: {
  prizes: LeaderboardPrize[];
  hasDetail?: boolean;
  description?: string;
}) {
  const [open, setOpen] = useState(false);
  const prizeMap: Record<string, number> = {};

  for (const prize of prizes) {
    for (const item of prize.items) {
      const amount = +item.amount * (prize.end_rank - prize.start_rank + 1);
      if (prizeMap[item.symbol_slug]) {
        prizeMap[item.symbol_slug] += amount;
      } else {
        prizeMap[item.symbol_slug] = amount;
      }
    }
  }

  const allPrizeItems = Object.entries(prizeMap).map(([slug, amount]) => ({
    slug,
    amount: amount.toString(), // Convert back to string
  }));
  const sortedPrizeByRank = prizes.sort(
    (p1, p2) => p1.start_rank - p2.start_rank,
  );

  return (
    <div>
      <div
        className="flex flex-wrap items-center gap-2 text-sm"
        onClick={() => {
          if (hasDetail) {
            setOpen(true);
          }
        }}
      >
        {allPrizeItems.map((item, index) => (
          <Fragment key={item.slug}>
            {index !== 0 && (
              <div className="h-1 w-1 rounded-full bg-v1-border-secondary"></div>
            )}
            <PrizeCoin amount={+item.amount} slug={item.slug} />
          </Fragment>
        ))}
        {hasDetail && <Icon name={bxInfoCircle} size={16} />}
      </div>
      <DrawerModal
        maskClosable={true}
        onClose={() => setOpen(false)}
        open={open}
      >
        <div className="flex flex-col items-center text-center">
          <h1 className="-mt-5 font-bold">Top Leaderboard Prizes</h1>
          <p className="pt-3 pb-6">
            🏆 Trade, climb the leaderboard, and win exclusive rewards!
          </p>
          {sortedPrizeByRank.map((prize, index) => (
            <div
              className={clsx(
                'mb-2 flex h-12 w-full items-center gap-3 rounded-xl border border-transparent bg-v1-surface-l5 p-2 text-xs',
              )}
              key={prize.start_rank}
            >
              <div className="w-6">{index + 1}</div>
              {index < 3 && (
                <img
                  alt=""
                  src={index === 0 ? first : index === 1 ? second : third}
                />
              )}
              <div>
                {prize.start_rank === prize.end_rank
                  ? rankOrdinalNumber(prize.start_rank)
                  : `${rankOrdinalNumber(
                      prize.start_rank,
                    )} - ${rankOrdinalNumber(prize.end_rank)}`}{' '}
                Place
              </div>
              <div className="ms-auto flex items-center gap-2">
                {prize.items.map((item, index) => (
                  <Fragment key={item.symbol_slug}>
                    {index !== 0 && (
                      <div className="h-1 w-1 rounded-full bg-v1-border-secondary"></div>
                    )}
                    <PrizeCoin amount={+item.amount} slug={item.symbol_slug} />
                  </Fragment>
                ))}
              </div>
            </div>
          ))}
          <p className="mt-3">{description}</p>
        </div>
      </DrawerModal>
    </div>
  );
}

export function CountdownBar({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}) {
  const endTimeRemaining = dayjs(endDate).fromNow(true);
  const startTime = new Date(startDate).getTime();
  const endTime = new Date(endDate).getTime();
  const percentage = Math.min(
    ((Date.now() - startTime) * 100) / (endTime - startTime),
    100,
  );

  return (
    <div className="flex items-center justify-between gap-4">
      <span>{endTimeRemaining} Left</span>
      <div className="h-2 w-36 rounded-3xl bg-white/40">
        <div
          className="h-full rounded-3xl bg-white"
          style={{
            width: `${percentage}%`,
          }}
        ></div>
      </div>
    </div>
  );
}
