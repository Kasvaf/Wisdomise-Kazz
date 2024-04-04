import { useTranslation } from 'react-i18next';
import { useInvoicesQuery, useSubscription } from 'api';
import Card from 'shared/Card';
import mailIconSrc from '../../images/mail.svg';
import CurrentPlan from './CurrentPlan';
import NextPlan from './NextPlan';

export default function OverviewTab() {
  const { level } = useSubscription();
  const invoices = useInvoicesQuery();
  const { t } = useTranslation('billing');

  // TODO: In Free mode may be we can remove this alert for crypto
  const lastInvoice = invoices.data?.results.at(0);
  const hasOpenCryptoPayment =
    level === 0 &&
    lastInvoice?.payment_method === 'CRYPTO' &&
    lastInvoice.status === 'open';

  if (hasOpenCryptoPayment) {
    return (
      <Card className="flex flex-col items-center justify-center !py-20">
        <img src={mailIconSrc} />
        <p className="mt-12 text-xl font-medium text-white">
          {t('subscription-details.overview.is-on-the-way.title')}
        </p>
        <p className="mt-8 max-w-[450px] text-center text-base font-medium text-white/60">
          {t('subscription-details.overview.is-on-the-way.description')}
        </p>
      </Card>
    );
  }

  return (
    <div className="text-base">
      <CurrentPlan />
      <NextPlan />
    </div>
  );
}
