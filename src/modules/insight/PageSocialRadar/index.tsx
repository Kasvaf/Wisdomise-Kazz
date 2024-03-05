import * as numerable from 'numerable';
import { Trans, useTranslation } from 'react-i18next';
import PageWrapper from 'modules/base/PageWrapper';
import { useCoinTelegramSignals, useMarketInfoFromTelegramSignals } from 'api';
import BetaVersion from 'shared/BetaVersion';
import img1 from './images/img1.png';
import infoImg from './images/info.svg';
import SignalsTable from './SignalsTable';
import HotCoinSignal from './HotCoinSignal';

export default function PageSocialRadar() {
  const { t } = useTranslation('social-radar');
  const signals = useCoinTelegramSignals();
  const marketInfo = useMarketInfoFromTelegramSignals();

  return (
    <PageWrapper
      className="leading-none mobile:leading-normal"
      loading={marketInfo.isLoading || signals.isLoading}
    >
      <p className="flex items-center gap-3 pl-2 font-semibold">
        {t('title')}
        <BetaVersion />
      </p>

      <section className="mt-9 w-full rounded-2xl bg-[#1E1F24]">
        <div className="rounded-t-2xl bg-[#1A1B20] px-6 py-5 text-sm">
          {t('market-info.title')}
          <span className="ml-1 rounded-full bg-[#40F19C33] px-2 py-1 text-xxs leading-none text-[#40F19C] mobile:hidden">
            {t('market-info.title-badge')}
          </span>
        </div>

        <div className="flex justify-between p-6 mobile:p-3">
          <div className="flex flex-col justify-between">
            <div>
              <p className="font-medium">{t('market-info.description')}</p>
              <Trans
                ns="social-radar"
                i18nKey="market-info.telegram-channel-count"
              >
                <p className="mt-4 text-xs text-white/60">
                  Wisdomise Social Radar Scanned{' '}
                  <span className="font-bold text-[#34A3DA]">
                    {{ channelsCount: marketInfo.data?.total_channels || 0 }}
                  </span>{' '}
                  Telegram Channels in the Past 24 Hours.
                </p>
              </Trans>
            </div>

            <section className="mt-10 grid grid-cols-2 gap-3">
              <div className=" rounded-xl bg-black/10 p-3">
                <p className="text-xs">{t('market-info.side.title')}</p>
                <p className="mt-2 text-xxs text-white/40">
                  {t('market-info.side.description')}
                </p>
                <p className="mt-7 text-right text-xl capitalize text-white/80">
                  {marketInfo.data?.gauge_tag.toLowerCase()}
                </p>
              </div>
              <div className="rounded-xl bg-black/10 p-3">
                <p className="text-xs">
                  {t('market-info.telegram-community.title')}
                </p>
                <p className="mt-2 text-xxs text-white/40">
                  {t('market-info.telegram-community.description')}
                </p>
                <p className="mt-7 text-right text-xl text-white/80">
                  {numerable.format(marketInfo.data?.analyzed_messages, '0 a')}
                </p>
              </div>
            </section>
          </div>
          <img src={img1} className="-my-6 -mr-6 w-1/2 mobile:hidden" />
        </div>
      </section>

      <section className="border-b border-white/5 pb-8">
        <div className="my-8 flex w-full items-center justify-between mobile:flex-col mobile:items-start mobile:gap-4">
          <p className="pl-2 font-semibold">{t('hot-coins.title')}</p>
          <p className="flex items-center gap-1 text-xs text-white/80">
            <img src={infoImg} />
            {t('hot-coins.description')}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-6 mobile:grid-cols-1">
          {signals.data
            ?.slice(0, 6)
            .map((d, i) => <HotCoinSignal key={i} data={d} />)}
        </div>
      </section>
      <SignalsTable signals={signals.data?.slice(6) || []} />
    </PageWrapper>
  );
}
