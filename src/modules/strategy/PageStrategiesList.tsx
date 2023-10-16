import { NavLink } from 'react-router-dom';
import dayjs from 'dayjs';
import { bxRightArrowAlt } from 'boxicons-quasar';
import PageWrapper from 'modules/base/PageWrapper';
import Card from 'shared/Card';
import Button from 'modules/shared/Button';
import CoinsIcons from 'modules/shared/CoinsIcons';
import Icon from 'modules/shared/Icon';
import TitleHint from './TitleHint';

interface Strategy {
  key: string;
  title: string;
  created_at: number;
  market_name: 'SPOT' | 'FUTURES';
  assets: string[];
  active_positions_count: number;
  week_positions_count: number;
}

const randomInt = (max: number) => Math.floor(Math.random() * max);
const randomStrategy = (): Strategy => ({
  key: (Math.random() + 1).toString(36).substring(2),
  title: 'Strategy Name',
  created_at: Date.now() - 1000 * 60 * 60 * 24 * (1 + randomInt(5)),
  market_name: ['SPOT', 'FUTURES'][randomInt(2)] as 'SPOT' | 'FUTURES',
  assets: ['BTC', 'USDT'],
  active_positions_count: randomInt(5),
  week_positions_count: randomInt(10),
});

export default function PageStrategiesList() {
  const strategies: Strategy[] = [
    randomStrategy(),
    randomStrategy(),
    randomStrategy(),
    randomStrategy(),
  ];

  return (
    <PageWrapper>
      <h1 className="mb-8 text-xl font-semibold">Strategy Builder</h1>

      <div className="grid grid-cols-3 gap-4">
        {strategies.map(s => (
          <NavLink key={s.key} to={`/app/strategy/${s.key}`}>
            <Card className="cursor-pointer !px-6 !py-4 hover:bg-white/10">
              <TitleHint title={s.title}>
                Created {dayjs(s.created_at).fromNow()}
              </TitleHint>

              <div className="mt-3 flex justify-between">
                <div className="rounded-sm bg-white/5 px-3 py-2 text-xs">
                  {s.market_name}
                </div>

                <CoinsIcons coins={s.assets} />
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="flex flex-col justify-between rounded-md bg-black/20 p-3">
                  <div className="text-sm">Active positions</div>
                  <div className="text-end text-2xl">
                    {s.active_positions_count}
                  </div>
                </div>

                <div className="flex flex-col justify-between rounded-md bg-black/20 p-3">
                  <div>
                    <div>Positions</div>
                    <div className="text-xs text-white/40">Last week</div>
                  </div>
                  <div className="text-end text-2xl">
                    {s.week_positions_count}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-center text-center text-sm text-white/30">
                <div className="mr-2">Open Strategy</div>
                <Icon name={bxRightArrowAlt} />
              </div>
            </Card>
          </NavLink>
        ))}
      </div>

      <div className="mt-4 flex justify-end">
        <Button to="/app/strategy/new">New Strategy</Button>
      </div>
    </PageWrapper>
  );
}
