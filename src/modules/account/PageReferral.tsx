import { type ReactNode, useState } from 'react';
import { clsx } from 'clsx';
import { useReferralStatusQuery } from 'api';
import PageWrapper from 'modules/base/PageWrapper';
import CopyInputBox from 'shared/CopyInputBox';
import Card from 'shared/Card';

export default function ReferralPage() {
  const [selectedInterval, setSelectedInterval] = useState(30);
  // const { data: account, isLoading } = useAccountQuery();
  const { data: referral, isLoading } =
    useReferralStatusQuery(selectedInterval);
  const myOrigin = window.location.origin;

  return (
    <PageWrapper loading={isLoading}>
      <h1 className="mb-5">Referral Program</h1>
      {referral && (
        <>
          <Card className="mb-10 flex flex-wrap gap-2 gap-y-8">
            <CopyInputBox
              label="Referral Code"
              value={referral.referral_code}
              style="alt"
            />
            <CopyInputBox
              label="Referral Link"
              value={`${myOrigin}/ref/${referral.referral_code}`}
              className="grow"
              style="alt"
            />
          </Card>

          <div className="mb-6 flex items-baseline gap-4">
            <h2>Referral Insight</h2>
            <div className="flex gap-2">
              {[90, 60, 30].map(interval => {
                return (
                  <button
                    key={interval}
                    className={clsx(
                      interval === selectedInterval && '!bg-black/80',
                      'rounded-full bg-white/10 px-6 py-1',
                    )}
                    onClick={() => setSelectedInterval(interval)}
                  >
                    {interval}d
                  </button>
                );
              })}
            </div>
          </div>
          <div className="mb-4 grid grid-cols-12 gap-9">
            <ReferralCard
              title="Friends invited"
              interval={referral.interval_referred_users_count}
              all={referral.referred_users_count}
            />
            <ReferralCard
              title="Subscribed Friends"
              interval={referral.interval_active_referred_users_count}
              all={referral.active_referred_users_count}
            />
            <ReferralCard
              title="Wisdomise revenue from your referral"
              interval={`$${referral.interval_wisdomise_referral_revenue ?? 0}`}
              all={referral.wisdomise_referral_revenue}
            />
            <ReferralCard
              title="Your profit"
              interval={`$${referral.interval_referral_revenue ?? 0}`}
              all={referral.referral_revenue}
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
  return (
    <Card className="col-span-6 flex flex-col items-center justify-between xl:col-span-3">
      <div className="text-center">{title}</div>
      <div className="my-4 text-2xl font-bold">{interval}</div>
      <div>
        <strong>{all}</strong> <span className="text-gray-400">all time</span>
      </div>
    </Card>
  );
}
