import { useCallback, useState } from 'react';
import { useSubmitCryptoPayment } from 'api';
import { type Network } from 'api/types/NetworksResponse';
import { type SubscriptionPlan } from 'api/types/subscription';
import Button from 'modules/shared/Button';
import TextBox from 'modules/shared/TextBox';

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
    onSubmitSuccess();
  }, [
    network.name,
    onSubmitSuccess,
    plan.key,
    plan.price,
    submitCryptoPayment,
    transactionId,
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
