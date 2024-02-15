import {
  AltRankWidget,
  NewsWidget,
  PassiveIncomeDeFiWidget,
  SPOWidget,
  SignalsWidget,
  TradingViewWidget,
  TrendingNFTsWidget,
  TrendingTweetsWidget,
} from '@wisdomise/widgets';
import '@wisdomise/widgets/dist/style.css';
import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getJwtToken } from 'modules/auth/jwt-store';
import { useAccountQuery, useSubscription } from 'api';
import { type AthenaWidget } from 'modules/athena/core';

interface Props {
  data: AthenaWidget;
}

export const WidgetDetector: React.FC<Props> = memo(
  ({ data }) => {
    const navigate = useNavigate();
    const user = useAccountQuery();
    const { plan } = useSubscription();

    switch (data.type) {
      case 'price_chart': {
        return (
          <TradingViewWidget symbol={data.symbol} settings={data.settings} />
        );
      }
      case 'news': {
        return <NewsWidget limit={data.limit} />;
      }
      case 'top_trending_tweets': {
        return <TrendingTweetsWidget />;
      }
      case 'top_trending_alt_coins': {
        return <AltRankWidget />;
      }
      case 'top_trending_nfts': {
        return <TrendingNFTsWidget />;
      }
      case 'smart_crypto_portfolio': {
        return <SPOWidget riskType={data.settings?.risk_type} />;
      }
      case 'last_positions': {
        return (
          <SignalsWidget
            token={getJwtToken() || undefined}
            telegramId={user.data?.telegram_id}
            userPlanLevel={plan?.level || 0}
            onUpgradeClick={() => navigate('/account/billing')}
          />
        );
      }
      case 'passive_income_defi': {
        return <PassiveIncomeDeFiWidget />;
      }
    }
    return null;
  },
  (pre, post) => JSON.stringify(pre) === JSON.stringify(post),
);

WidgetDetector.displayName = 'WidgetDetector';
