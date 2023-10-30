import { useCallback, useState } from 'react';
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
  const submitCryptoPayment = useSubmitCryptoPayment();
  const [transactionId, setTransactionId] = useState('');

  const onClick = useCallback(async () => {
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
  }, [
    plan.key,
    plan.price,
    network.name,
    transactionId,
    onSubmitSuccess,
    submitCryptoPayment,
  ]);

  return (
    <>
      <div className="flex w-full">
        <TextBox
          className="w-full"
          placeholder="Your ID"
          value={transactionId}
          onChange={setTransactionId}
          label="Transaction ID (Hash ID)"
        />
      </div>

      <Button
        onClick={onClick}
        disabled={!transactionId}
        loading={submitCryptoPayment.isLoading}
      >
        Done
      </Button>
    </>
  );
}
