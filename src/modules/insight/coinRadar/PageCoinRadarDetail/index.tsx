/* eslint-disable i18next/no-literal-string */
import { useParams } from 'react-router-dom';
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
  const { slug: slugParam } = useParams<{ slug: string }>();
  const slug = slugParam as string;

  const overview = useCoinOverview({ slug, priceHistoryDays: 1 });
  const messages = useSocialMessages(slug);
  const coinSignals = useCoinSignals();
  const signal = coinSignals.data?.find(sig => sig.symbol_slug === slug);
  const hasFlag = useHasFlag();

  const [activeTab, setActiveTab, socialTabs] = useSocialTab(slug);

  const activeTabMessages = messages.data?.filter(
    message =>
      (activeTab === 'all' || message.social_type === activeTab) &&
      hasFlag(`/insight/coin-radar/[slug]?tab=${message.social_type}`),
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
