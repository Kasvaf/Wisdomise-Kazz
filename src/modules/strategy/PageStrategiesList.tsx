import { NavLink } from 'react-router-dom';
import { bxRightArrowAlt } from 'boxicons-quasar';
import { useStrategiesQuery } from 'api';
import PageWrapper from 'modules/base/PageWrapper';
import Icon from 'shared/Icon';
import Card from 'shared/Card';
import Button from 'shared/Button';
import CoinsIcons from 'shared/CoinsIcons';
import TitleHint from './TitleHint';

export default function PageStrategiesList() {
  const { data, isLoading } = useStrategiesQuery();

  return (
    <PageWrapper loading={isLoading}>
      <h1 className="mb-8 text-xl font-semibold">Strategy Builder</h1>

      <div className="grid grid-cols-3 gap-4">
        {data?.results.map(s => (
          <NavLink key={s.key} to={`/app/strategy/${s.key}`}>
            <Card className="cursor-pointer !px-6 !py-4 hover:bg-white/10">
              <TitleHint title={s.name} />

              <div className="mt-3 flex justify-between">
                <div className="rounded-sm bg-white/5 px-3 py-2 text-xs">
                  {s.market_name}
                </div>

                <CoinsIcons coins={s.symbols} />
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="flex flex-col justify-between rounded-md bg-black/20 p-3">
                  <div className="text-sm">Active positions</div>
                  <div className="text-end text-2xl">
                    {s.open_positions ?? 0}
                  </div>
                </div>

                <div className="flex flex-col justify-between rounded-md bg-black/20 p-3">
                  <div>
                    <div>Positions</div>
                    <div className="text-xs text-white/40">Last week</div>
                  </div>
                  <div className="text-end text-2xl">
                    {s.last_week_positions ?? 0}
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
