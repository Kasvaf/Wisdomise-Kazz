import { useUserInfoQuery } from 'api';
import PageWrapper from 'modules/base/PageWrapper';
import TextBox from 'modules/shared/TextBox';

export default function PageProfile() {
  const userInfo = useUserInfoQuery();

  return (
    <PageWrapper loading={userInfo.isLoading} className="text-white">
      <h1 className="mb-8 text-xl font-semibold">Profile</h1>

      {userInfo.data && (
        <div>
          <TextBox
            label="Email Address"
            value={userInfo.data.account.email}
            className="lg:w-[30rem]"
          />
        </div>
      )}
    </PageWrapper>
  );
}
