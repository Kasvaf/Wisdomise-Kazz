import { NavLink } from 'react-router-dom';
import { bxPlus, bxRightArrowAlt } from 'boxicons-quasar';
import { useTranslation } from 'react-i18next';
import { useMyFinancialProductsQuery } from 'api/builder';
import PageWrapper from 'modules/base/PageWrapper';
import PriceChange from 'shared/PriceChange';
import CoinsIcons from 'shared/CoinsIcons';
import FabButton from 'shared/FabButton';
import Button from 'shared/Button';
import Icon from 'shared/Icon';
import Card from 'shared/Card';
import { FpBuilderOnboarding } from './FpBuilderOnboarding';

export default function PageFpList() {
  const { t } = useTranslation('builder');
  const { data, isLoading } = useMyFinancialProductsQuery();

  return (
    <PageWrapper loading={isLoading}>
      <FpBuilderOnboarding />

      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-xl font-semibold">
          {t('base:menu.fp-builder.title')}
        </h1>
        <Button className="mobile:hidden" to="/builder/fp/new">
          {t('fp.create-new.title')}
        </Button>
        <FabButton
          icon={bxPlus}
          to="/builder/fp/new"
          className="hidden mobile:block"
        />
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

                <CoinsIcons
                  coins={s.assets.map(x => x.asset.base.name) ?? []}
                  maxShow={3}
                />
              </div>

              <div className="mt-8 flex items-center justify-between">
                <div className="flex flex-col justify-between">
                  <PriceChange
                    value={Number(s.expected_apy)}
                    textClassName="!text-xl"
                    valueToFixed
                  />
                  <div className="text-sm text-white/30">
                    {t('fp.card.expected-apy')}
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-center text-center text-sm text-white">
                  <div className="mr-2">{t('common:actions.explore')}</div>
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
