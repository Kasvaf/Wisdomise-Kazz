import { useTranslation } from 'react-i18next';
import { useAccountQuery } from 'api';
import PageWrapper from 'modules/base/PageWrapper';
import TextBox from 'shared/TextBox';

export default function PageProfile() {
  const { t } = useTranslation();
  const account = useAccountQuery();

  return (
    <PageWrapper loading={account.isLoading}>
      <h1 className="mb-8 text-xl font-semibold">
        {t('base:menu.profile.title')}
      </h1>

      {account.data && (
        <div>
          <TextBox
            label={t('auth:email-address')}
            value={account.data.email}
            className="lg:w-[30rem]"
          />
        </div>
      )}
    </PageWrapper>
  );
}
