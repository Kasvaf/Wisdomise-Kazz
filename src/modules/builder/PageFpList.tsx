import { NavLink } from 'react-router-dom';
import { bxRightArrowAlt } from 'boxicons-quasar';
import { useMyFinancialProductsQuery } from 'api/builder';
import PageWrapper from 'modules/base/PageWrapper';
import PriceChange from 'shared/PriceChange';
import CoinsIcons from 'shared/CoinsIcons';
import Button from 'shared/Button';
import Icon from 'shared/Icon';
import Card from 'shared/Card';

export default function PageFpList() {
  const { data, isLoading } = useMyFinancialProductsQuery();

  return (
    <PageWrapper loading={isLoading}>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-xl font-semibold">My Financial Products</h1>
        <Button to="/builder/fp/new">Create New Financial Product</Button>
      </div>

      <div className="grid grid-cols-3 gap-4 mobile:grid-cols-1">
        {data?.map(s => (
          <NavLink key={s.key} to={`/builder/fp/${s.key}`}>
            <Card className="cursor-pointer !px-6 !py-4 hover:bg-black/40">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="text-xl">{s.title}</div>
                  <div className="ml-2 rounded-full bg-white/5 px-3 py-2 text-xs text-white/20">
                    {s.risk_level}
                  </div>
                </div>

                <CoinsIcons coins={s.assets.map(x => x.asset.symbol) ?? []} />
              </div>

              <div className="mt-8 flex items-center justify-between">
                <div className="flex flex-col justify-between">
                  <PriceChange
                    value={Number(s.expected_apy)}
                    textClassName="!text-xl"
                    valueToFixed
                  />
                  <div className="text-sm text-white/30">Expected APY</div>
                </div>

                <div className="mt-6 flex items-center justify-center text-center text-sm text-white">
                  <div className="mr-2">Explore</div>
                  <Icon name={bxRightArrowAlt} />
                </div>
              </div>
            </Card>
          </NavLink>
        ))}
      </div>
    </PageWrapper>
  );
}
