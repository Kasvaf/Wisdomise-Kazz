import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSubmitCryptoPayment } from 'api';
import { type Network } from 'api/types/NetworksResponse';
import { type SubscriptionPlan } from 'api/types/subscription';
import Button from 'modules/shared/Button';
import TextBox from 'modules/shared/TextBox';
import { analytics } from 'config/segment';

interface Props {
  network: Network;
  plan: SubscriptionPlan;
  onSubmitSuccess: () => void;
}

export default function SubmitTransactionID({
  plan,
  network,
  onSubmitSuccess,
}: Props) {
  const { t } = useTranslation('billing');
  const submitCryptoPayment = useSubmitCryptoPayment();
  const [transactionId, setTransactionId] = useState('');

  const onClick = async () => {
    await submitCryptoPayment.mutateAsync({
      amount_paid: plan.price,
      subscription_plan_key: plan.key,
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
          placeholder="Your ID"
          value={transactionId}
          onChange={setTransactionId}
          label={t('crypto-modal.input-hash-id')}
        />
      </div>

      <Button
        onClick={onClick}
        disabled={!transactionId}
        loading={submitCryptoPayment.isLoading}
      >
        {t('crypto-modal.btn-done')}
      </Button>
    </>
  );
}
