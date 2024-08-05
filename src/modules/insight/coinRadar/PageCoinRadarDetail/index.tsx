/* eslint-disable i18next/no-literal-string */
import { useParams, useSearchParams } from 'react-router-dom';
import { Tabs } from 'antd';
import { useLayoutEffect } from 'react';
import {
  useSocialMessages,
  useHasFlag,
  useCoinOverview,
  useCoinSignals,
} from 'api';
import PageWrapper from 'modules/base/PageWrapper';
import CoinInfo from './CoinInfo';
import { SocialMessage } from './SocialMessage';
import { useSocialTab } from './useSocialTab';

export default function PageCoinRadarDetail() {
  const { symbol: symbolParam } = useParams<{ symbol: string }>();
  const [searchParams] = useSearchParams();
  const name = searchParams.get('name') ?? undefined;
  const symbol = symbolParam as string;

  const overview = useCoinOverview({ symbol, name, priceHistoryDays: 1 });
  const messages = useSocialMessages(symbol);
  const coinSignals = useCoinSignals();
  const signal = coinSignals.data?.find(sig => sig.symbol_name === symbol);
  const hasFlag = useHasFlag();

  const [activeTab, setActiveTab, socialTabs] = useSocialTab(symbol);

  const activeTabMessages = messages.data?.filter(
    message =>
      (activeTab === 'all' || message.social_type === activeTab) &&
      hasFlag(`/insight/coin-radar/[symbol]?tab=${message.social_type}`),
  );

  useLayoutEffect(() => {
    document.documentElement.scrollTo(0, 0);
  }, []);

  return (
    <PageWrapper
      loading={
        messages.isLoading || overview.isLoading || coinSignals.isLoading
      }
      className="leading-none mobile:leading-normal"
    >
      {overview.data && (
        <CoinInfo className="mb-4" signal={signal} overview={overview.data} />
      )}
      {(messages.data?.length ?? 0) > 0 && (
        <>
          <Tabs
            onChange={newTab => setActiveTab(newTab as typeof activeTab)}
            items={socialTabs}
          />

          <section className="mt-6 columns-2 gap-6 mobile:columns-1">
            {activeTabMessages?.map(message => (
              <SocialMessage
                key={message.id}
                message={message}
                className="mb-6"
              />
            ))}
          </section>
        </>
      )}
    </PageWrapper>
  );
}
