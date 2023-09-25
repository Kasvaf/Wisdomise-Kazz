import { useAccountQuery } from 'api';
import PageWrapper from 'modules/base/PageWrapper';
import TextBox from 'modules/shared/TextBox';

export default function PageProfile() {
  const account = useAccountQuery();

  return (
    <PageWrapper loading={account.isLoading}>
      <h1 className="mb-8 text-xl font-semibold">Profile</h1>

      {account.data && (
        <div>
          <TextBox
            label="Email Address"
            value={account.data.email}
            className="lg:w-[30rem]"
          />
        </div>
      )}
    </PageWrapper>
  );
}
