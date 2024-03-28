import { type ReactNode, useState } from 'react';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { useReferralStatusQuery } from 'api';
import PageWrapper from 'modules/base/PageWrapper';
import CopyInputBox from 'shared/CopyInputBox';
import Card from 'shared/Card';

export default function ReferralPage() {
  const { t } = useTranslation('auth');
  const [selectedInterval, setSelectedInterval] = useState(30);
  // const { data: account, isLoading } = useAccountQuery();
  const { data: referral, isLoading } =
    useReferralStatusQuery(selectedInterval);
  const myOrigin = window.location.origin;

  return (
    <PageWrapper loading={isLoading}>
      <h1 className="mb-5">{t('page-referral.title')}</h1>
      {referral && (
        <>
          <Card className="mb-10 flex flex-wrap gap-2 gap-y-8">
            <CopyInputBox
              label={t('page-referral.referral-code')}
              value={referral.referral_code}
              style="alt"
            />
            <CopyInputBox
              label={t('page-referral.referral-link')}
              value={`${myOrigin}/ref/${referral.referral_code}`}
              className="grow"
              style="alt"
            />
          </Card>

          <div className="mb-6 flex items-baseline gap-4">
            <h2>{t('page-referral.referral-insight')}</h2>
            <div className="flex gap-2">
              {[30, 60, 90].map(interval => {
                return (
                  <button
                    key={interval}
                    className={clsx(
                      interval === selectedInterval && '!bg-black/80',
                      'rounded-full bg-white/10 px-6 py-1',
                    )}
                    onClick={() => setSelectedInterval(interval)}
                  >
                    {`${interval}d`}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="mb-4 grid grid-cols-1 gap-9 sm:grid-cols-2 xl:grid-cols-4">
            <ReferralCard
              title={t('page-referral.friends-invited')}
              interval={referral.interval_referred_users_count}
              all={referral.referred_users_count}
            />
            <ReferralCard
              title={t('page-referral.subscribed-friends')}
              interval={referral.interval_active_referred_users_count}
              all={referral.active_referred_users_count}
            />
            <ReferralCard
              title={t('page-referral.wisdomise-revenue')}
              interval={`$${referral.interval_wisdomise_referral_revenue.toLocaleString()}`}
              all={referral.wisdomise_referral_revenue.toLocaleString()}
            />
            <ReferralCard
              title={t('page-referral.your-profit')}
              interval={`$${referral.interval_referral_revenue.toLocaleString()}`}
              all={referral.referral_revenue.toLocaleString()}
            />
          </div>
        </>
      )}
    </PageWrapper>
  );
}

interface ReferralCardProps {
  title: string;
  interval: ReactNode;
  all: ReactNode;
}

function ReferralCard({ title, interval, all }: ReferralCardProps) {
  const { t } = useTranslation('auth');
  return (
    <Card className="flex flex-col items-center justify-between">
      <div className="text-center">{title}</div>
      <div className="my-4 text-2xl font-bold">{interval}</div>
      <div>
        <strong>{all}</strong>{' '}
        <span className="text-gray-400">{t('page-referral.all-time')}</span>
      </div>
    </Card>
  );
}
