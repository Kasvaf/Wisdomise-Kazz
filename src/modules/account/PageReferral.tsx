import { useAccountQuery } from 'api';
import PageWrapper from 'modules/base/PageWrapper';
import CopyInputBox from 'shared/CopyInputBox';
import Card from 'shared/Card';

export default function ReferralPage() {
  const { data: account, isLoading } = useAccountQuery();
  const myOrigin = window.location.origin;

  return (
    <PageWrapper loading={isLoading}>
      <h1 className="mb-14">Referral Program</h1>
      {account && (
        <>
          <div className="flex flex-wrap gap-2 gap-y-8">
            <CopyInputBox
              label="Referral Code"
              value={account.referral_code}
              style="alt"
            />
            <CopyInputBox
              label="Referral Link"
              value={`${myOrigin}/ref/${account.referral_code}`}
              className="grow"
              style="alt"
            />
          </div>

          <hr className="my-14 border-white/10" />
          <div className="mb-4 flex gap-9">
            <Card>
              <div className="mb-4 text-2xl font-bold">
                {account.referred_users_count}
              </div>
              <div className="font-bold">Friends Invited</div>
            </Card>

            <Card>
              <div className="mb-4 text-2xl font-bold">
                {account.active_referred_users_count}
              </div>
              <div className="font-bold">Subscribed Friends</div>
            </Card>
          </div>
        </>
      )}
    </PageWrapper>
  );
}
