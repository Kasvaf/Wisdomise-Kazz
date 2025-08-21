import { useSubmitCryptoPayment } from 'api';
import type { Network } from 'api/types/NetworksResponse';
import type { SubscriptionPlan } from 'api/types/subscription';
import { analytics } from 'config/segment';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from 'shared/Button';
import TextBox from 'shared/TextBox';

interface Props {
  network: Network;
  plan: SubscriptionPlan;
  invoiceKey?: string;
  onSubmitSuccess: () => void;
}

export default function SubmitTransactionID({
  plan,
  network,
  invoiceKey,
  onSubmitSuccess,
}: Props) {
  const { t } = useTranslation('billing');
  const submitCryptoPayment = useSubmitCryptoPayment();
  const [transactionId, setTransactionId] = useState('');

  const onClick = async () => {
    await submitCryptoPayment.mutateAsync({
      invoice_key: invoiceKey,
      amount_paid: invoiceKey ? undefined : plan.price,
      subscription_plan_key: invoiceKey ? undefined : plan.key,
      crypto_invoice: {
        symbol_name: 'USDT',
        network_name: network.name,
        transaction_id: transactionId,
      },
    });
    void analytics.track('cryptopayment_transactionid');
    onSubmitSuccess();
  };

  return (
    <>
      <div className="flex w-full">
        <TextBox
          className="w-full"
          label={t('crypto-modal.input-hash-id')}
          onChange={setTransactionId}
          placeholder="Your ID"
          value={transactionId}
        />
      </div>

      <Button
        disabled={!transactionId}
        loading={submitCryptoPayment.isPending}
        onClick={onClick}
      >
        {t('crypto-modal.btn-done')}
      </Button>
    </>
  );
}
