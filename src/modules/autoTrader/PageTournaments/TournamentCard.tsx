import { Fragment, useState } from 'react';
import dayjs from 'dayjs';
import { clsx } from 'clsx';
import { bxInfoCircle } from 'boxicons-quasar';
import { Tooltip } from 'antd';
import cardBg from 'modules/autoTrader/PageTournaments/images/card-bg.svg';
import cardBg1 from 'modules/autoTrader/PageTournaments/images/card-bg-1.svg';
import cardBg2 from 'modules/autoTrader/PageTournaments/images/card-bg-2.svg';
import first from 'modules/autoTrader/PageTournaments/images/1st.svg';
import second from 'modules/autoTrader/PageTournaments/images/2nd.svg';
import third from 'modules/autoTrader/PageTournaments/images/3rd.svg';
import snow from 'modules/autoTrader/PageTournaments/images/snow.svg';
import stonfi from 'modules/autoTrader/PageTournaments/images/stonfi.png';
import live from 'modules/autoTrader/PageTournaments/images/live.svg';
import { type Tournament, type TournamentStatus } from 'api/tournament';
import { Coin } from 'shared/Coin';
import { useSymbolInfo } from 'api/symbol';
import { DrawerModal } from 'shared/DrawerModal';
import Icon from 'shared/Icon';
// eslint-disable-next-line import/max-dependencies
import Button from 'shared/Button';

export default function TournamentCard({
  className,
  tournament,
  hasDetail,
}: {
  className?: string;
  tournament: Tournament;
  hasDetail?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const rankText = (rank: number) => {
    switch (rank) {
      case 1: {
        return '1st';
      }
      case 2: {
        return '2nd';
      }
      case 3: {
        return '3rd';
      }
      default: {
        return `${rank}th`;
      }
    }
  };

  const bgIndex = uuidToNumber(tournament.key);
  const bgSrc = bgIndex === 0 ? cardBg : bgIndex === 1 ? cardBg1 : cardBg2;

  const prizeMap: Record<string, number> = {};

  for (const prize of tournament.prizes) {
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
  const sortedPrizeByRank = tournament.prizes.sort(
    (p1, p2) => p1.start_rank - p2.start_rank,
  );

  return (
    <div
      key={tournament.key}
      className={clsx(
        'relative mb-3 block overflow-hidden rounded-xl bg-v1-surface-l2 p-4 pb-6 text-sm',
        className,
      )}
    >
      <img src={bgSrc} alt="" className="absolute bottom-0 end-0 h-full" />
      <img src={snow} alt="" className="absolute bottom-0 end-0" />
      <div className="relative">
        <div className="flex items-center gap-2">
          <img src={stonfi} alt="stonfi" className="h-8 w-8" />
          <div>
            <h2 className="text-sm">{tournament.name}</h2>
            <h1 className="text-xs text-v1-content-secondary">
              Volume Tournament
            </h1>
          </div>
          <div className="ms-auto">
            <TournamentStatusBadge statusValue={tournament.status} />
          </div>
        </div>
        <div className="my-3">
          {tournament.description}
          {hasDetail && (
            <Tooltip title={tournament.tooltip_content}>
              <Icon
                name={bxInfoCircle}
                className="ms-2 inline-block text-v1-content-secondary"
                size={16}
              />
            </Tooltip>
          )}
        </div>
        <hr className="border-white/5" />
        <div className="mt-3 flex justify-between gap-4">
          <div className="shrink-0 text-v1-content-secondary">Prize Pool</div>
          <div
            className="flex flex-wrap items-center gap-2"
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
                <PrizeCoin slug={item.slug} amount={+item.amount} />
              </Fragment>
            ))}
            {hasDetail && (
              <Icon
                name={bxInfoCircle}
                className="text-v1-content-secondary"
                size={16}
              />
            )}
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          {tournament.status === 'live' ? (
            <>
              <div className="text-v1-content-secondary">
                {dayjs(tournament.end_time).fromNow(true)} Left
              </div>
              <div className="h-2 w-36 rounded-3xl bg-white/30">
                <div
                  className="h-full rounded-3xl bg-white"
                  style={{
                    width: `${
                      ((Date.now() -
                        new Date(tournament.start_time).getTime()) *
                        100) /
                      (new Date(tournament.end_time).getTime() -
                        new Date(tournament.start_time).getTime())
                    }%`,
                  }}
                ></div>
              </div>
            </>
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
      <DrawerModal
        open={open}
        onClose={() => setOpen(false)}
        destroyOnClose
        className="max-w-lg mobile:!h-[30rem] mobile:max-w-full"
        maskClosable={true}
      >
        <div className="flex flex-col items-center text-center">
          <h1 className="-mt-5 font-bold">Top Leaderboard Prizes</h1>
          <p className="pb-6 pt-3">
            🏆 Trade, climb the leaderboard, and win exclusive rewards!
          </p>
          {sortedPrizeByRank.map((prize, index) => (
            <div
              key={prize.start_rank}
              className={clsx(
                'mb-2 flex h-12 w-full items-center gap-3 rounded-xl border border-transparent bg-v1-surface-l2 p-2 text-xs',
              )}
            >
              <div className="w-6">{index + 1}</div>
              {index < 3 && (
                <img
                  src={index === 0 ? first : index === 1 ? second : third}
                  alt=""
                />
              )}
              <div>
                {prize.start_rank === prize.end_rank
                  ? rankText(prize.start_rank)
                  : `${rankText(prize.start_rank)} - ${rankText(
                      prize.end_rank,
                    )}`}{' '}
                Place
              </div>
              <div className="ms-auto flex items-center gap-2">
                {prize.items.map((item, index) => (
                  <Fragment key={item.symbol_slug}>
                    {index !== 0 && (
                      <div className="h-1 w-1 rounded-full bg-v1-border-secondary"></div>
                    )}
                    <PrizeCoin slug={item.symbol_slug} amount={+item.amount} />
                  </Fragment>
                ))}
              </div>
            </div>
          ))}
          <Button
            variant="alternative"
            className="absolute bottom-6 end-6 start-6"
            onClick={() => {
              setOpen(false);
            }}
          >
            Close
          </Button>
        </div>
      </DrawerModal>
    </div>
  );
}

export function uuidToNumber(uuid: string) {
  let sum = 0;
  for (const char of uuid) {
    sum += char.codePointAt(0) ?? 0;
  }
  return sum % 3;
}

const TOURNAMENT_STATUS: Array<{
  value: TournamentStatus;
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
];

function TournamentStatusBadge({
  statusValue,
}: {
  statusValue: TournamentStatus;
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
      {statusValue === 'live' && <img src={live} alt="" />}
    </div>
  );
}

function PrizeCoin({ slug, amount }: { slug: string; amount: number }) {
  const { data: coin } = useSymbolInfo(slug);

  return coin ? (
    <div className="flex items-center">
      <Coin mini noText nonLink coin={coin} />
      <span>{amount}</span>
      <span className="ms-1">{coin.abbreviation}</span>
    </div>
  ) : null;
}
