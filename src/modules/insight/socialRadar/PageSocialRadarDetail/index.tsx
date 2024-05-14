import { useParams } from 'react-router-dom';
import { Tabs } from 'antd';
import { type PropsWithChildren, useState, useLayoutEffect } from 'react';
import {
  type SocialRadarTelegramMessage,
  useCoinMessages,
  type SocialRadarRedditMessage,
} from 'api';
import PageWrapper from 'modules/base/PageWrapper';
import SocialRadarRedditMessageComponent from './SocialRadarRedditMessage';
import SocialRadarTelegramMessageComponent from './SocialRadarTelegramMessage';
import CoinInfo from './CoinInfo';

export default function PageSocialRadarDetail() {
  // const { t } = useTranslation('social-radar');
  const params = useParams<{ symbol: string }>();
  const [activeTab, setActiveTab] = useState('all');
  const messages = useCoinMessages(params.symbol || '');

  useLayoutEffect(() => {
    document.documentElement.scrollTo(0, 0);
  }, []);

  return (
    <PageWrapper
      loading={messages.isLoading}
      className="leading-none mobile:leading-normal"
    >
      <CoinInfo />
      <Tabs
        onChange={setActiveTab}
        items={[
          {
            label: 'All Socials Feed',
            key: 'all',
            children: (
              <TabTitle>
                Analyze signals for {params.symbol} in Telegram channels &
                Reddit Community
              </TabTitle>
            ),
          },
          {
            label: 'Telegram',
            key: 'telegram',
            children: (
              <TabTitle>
                Analyze signals for {params.symbol} in Telegram channels
              </TabTitle>
            ),
          },
          {
            label: 'Reddit',
            key: 'reddit',
            children: (
              <TabTitle>
                Analyze signals for {params.symbol} in Reddit community
              </TabTitle>
            ),
          },
        ]}
      />

      <section className="mt-6 columns-2 gap-4 mobile:columns-1">
        {messages.data
          ?.filter(msg =>
            activeTab === 'reddit'
              ? isRedditMessage(msg)
              : activeTab === 'telegram'
              ? !isRedditMessage(msg)
              : true,
          )
          .map(msg =>
            isRedditMessage(msg) ? (
              <SocialRadarRedditMessageComponent
                message={msg}
                key={msg.post_id}
              />
            ) : (
              <SocialRadarTelegramMessageComponent
                key={msg.key}
                message={msg}
              />
            ),
          )}
      </section>
    </PageWrapper>
  );
}

const TabTitle = (props: PropsWithChildren) => (
  <p className="mt-4 text-xs text-white/60" {...props} />
);

const isRedditMessage = (
  msg: SocialRadarRedditMessage | SocialRadarTelegramMessage,
): msg is SocialRadarRedditMessage =>
  !!(msg as SocialRadarRedditMessage).post_id;
