import { Fragment } from 'react';
import dayjs from 'dayjs';
import { clsx } from 'clsx';
import { type Tournament, type TournamentStatus } from 'api/tournament';
import cardBg from 'modules/autoTrader/PageTournaments/card-bg.svg';
import snow from 'modules/autoTrader/PageTournaments/snow.svg';
import stonfi from 'modules/autoTrader/PageTournaments/stonfi.png';
import live from 'modules/autoTrader/PageTournaments/live.svg';
import { useCoinOverview } from 'api';
import { Coin } from 'shared/Coin';

export default function TournamentCard({
  className,
  tournament,
}: {
  className?: string;
  tournament: Tournament;
}) {
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

  return (
    <div
      key={tournament.key}
      className={clsx(
        'relative mb-3 block overflow-hidden rounded-xl bg-v1-surface-l2 p-4 pb-6 text-sm',
        className,
      )}
    >
      <img src={cardBg} alt="" className="absolute bottom-0 end-0 h-full" />
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
        <p className="my-3">{tournament.description}</p>
        <hr className="border-white/5" />
        {tournament.prizes.map(prize => (
          <div key={prize.start_rank} className="mt-3 flex justify-between">
            <div className="text-v1-content-secondary">
              {prize.start_rank === prize.end_rank
                ? rankText(prize.start_rank)
                : `${rankText(prize.start_rank)} - ${rankText(
                    prize.end_rank,
                  )}`}{' '}
              place
            </div>
            <div className="flex items-center gap-2">
              {prize.items.map((item, index) => (
                <Fragment key={item.symbol_slug}>
                  {index !== 0 && (
                    <div className="h-1 w-1 rounded-full bg-v1-border-secondary"></div>
                  )}
                  <div className="flex items-center">
                    <PrizeCoin slug={item.symbol_slug} />
                    {+item.amount}
                  </div>
                </Fragment>
              ))}
            </div>
          </div>
        ))}
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
    </div>
  );
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

function PrizeCoin({ slug }: { slug: string }) {
  const { data: coin } = useCoinOverview({ slug });

  return coin ? <Coin mini noText coin={coin.symbol} /> : null;
}
