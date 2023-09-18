import { useUserInfoQuery } from 'api';
import PageWrapper from 'modules/base/PageWrapper';
import CopyInputBox from 'shared/CopyInputBox';
import Card from './Card';

export default function ReferralPage() {
  const userInfo = useUserInfoQuery();
  const user = userInfo.data?.account;
  const myOrigin = window.location.origin;

  return (
    <PageWrapper loading={userInfo.isLoading}>
      <h1 className="mb-14">Referral Program</h1>
      {user && (
        <>
          <div className="flex flex-wrap gap-2 gap-y-8">
            <CopyInputBox
              label="Referral Code"
              value={user.referral_code}
              style="alt"
            />
            <CopyInputBox
              label="Referral Link"
              value={`${myOrigin}/account/ref/${user.referral_code}`}
              className="grow"
              style="alt"
            />
          </div>

          <hr className="my-14 border-white/10" />
          <div className="mb-4 flex gap-9">
            <Card>
              <div className="mb-4 text-2xl font-bold">
                {user.referred_users_count}
              </div>
              <div className="font-bold">Friends Invited</div>
            </Card>

            <Card>
              <div className="mb-4 text-2xl font-bold">
                {user.active_referred_users_count}
              </div>
              <div className="font-bold">Subscribed Friends</div>
            </Card>
          </div>
        </>
      )}
    </PageWrapper>
  );
}
