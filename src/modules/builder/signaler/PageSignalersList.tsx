import { NavLink } from 'react-router-dom';
import { bxPlus, bxRightArrowAlt } from 'boxicons-quasar';
import { useTranslation } from 'react-i18next';
import { useMySignalersQuery } from 'api/builder';
import PageWrapper from 'modules/base/PageWrapper';
import CoinsIcons from 'shared/CoinsIcons';
import FabButton from 'shared/FabButton';
import Button from 'shared/Button';
import Icon from 'shared/Icon';
import Card from 'shared/Card';
import TitleHint from '../TitleHint';
import { SignalBuilderOnboarding } from './SignalBuilderOnboarding';

export default function PageSignalersList() {
  const { t } = useTranslation('builder');
  const { data, isLoading } = useMySignalersQuery();

  return (
    <PageWrapper loading={isLoading}>
      <SignalBuilderOnboarding />

      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-xl font-semibold">
          {t('base:menu.signal-builder.title')}
        </h1>
        <Button
          className="mobile:hidden"
          to="/marketplace/builder/signalers/new"
        >
          {t('signaler.create-new.title')}
        </Button>
        <FabButton
          icon={bxPlus}
          to="/marketplace/builder/signalers/new"
          className="hidden mobile:block"
        />
      </div>

      <div className="grid grid-cols-3 gap-4 mobile:grid-cols-1">
        {data?.map(s => (
          <NavLink key={s.key} to={`/marketplace/builder/signalers/${s.key}`}>
            <Card className="cursor-pointer !px-6 !py-4 hover:bg-black/40">
              <TitleHint title={s.name} />

              <div className="mt-3 flex justify-between">
                <div className="rounded-sm bg-white/5 px-3 py-2 text-xs">
                  {s.market_name}
                </div>

                <CoinsIcons
                  coins={s.assets.map(x => x.base.name) ?? []}
                  maxShow={3}
                />
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="flex flex-col justify-between rounded-md bg-black/20 p-3">
                  <div className="text-sm">
                    {t('signaler.card.active-positions')}
                  </div>
                  <div className="text-end text-2xl">
                    {s.open_positions ?? 0}
                  </div>
                </div>

                <div className="flex flex-col justify-between rounded-md bg-black/20 p-3">
                  <div>
                    <div>{t('signaler.card.positions')}</div>
                    <div className="text-xs text-white/40">
                      {t('signaler.card.last-week')}
                    </div>
                  </div>
                  <div className="text-end text-2xl">
                    {s.last_week_positions ?? 0}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-center text-center text-sm text-white/30">
                <div className="mr-2">{t('signaler.card.open-signaler')}</div>
                <Icon name={bxRightArrowAlt} />
              </div>
            </Card>
          </NavLink>
        ))}
      </div>
    </PageWrapper>
  );
}
