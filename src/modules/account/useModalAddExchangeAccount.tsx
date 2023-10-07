import { useCallback, useState } from 'react';
import { notification } from 'antd';
import {
  type ExchangeTypes,
  useCreateExchangeAccount,
  type MarketTypes,
} from 'api';
import { unwrapErrorMessage } from 'utils/error';
import useModal from 'shared/useModal';
import TextBox from 'shared/TextBox';
import Button from 'shared/Button';
import ExchangeSelector from './ExchangeSelector';
import MarketSelector from './MarketSelector';

const ModalAddExchangeAccount: React.FC<{
  onResolve?: (account?: string) => void;
}> = ({ onResolve }) => {
  const [exchange, setExchange] = useState<ExchangeTypes>('BINANCE');
  const [market, setMarket] = useState<MarketTypes>('SPOT');
  const [accountName, setAccountName] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [secretKey, setSecretKey] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const createAccount = useCreateExchangeAccount();

  const addHandler = useCallback(async () => {
    try {
      setIsSubmitting(true);
      const acc = await createAccount({
        title: accountName,
        exchange_name: exchange,
        market_name: market,
        api_key: apiKey,
        secret_key: secretKey,
      });
      onResolve?.(acc.key);
    } catch (error) {
      notification.error({ message: unwrapErrorMessage(error) });
    } finally {
      setIsSubmitting(false);
    }
  }, [
    createAccount,
    exchange,
    market,
    accountName,
    apiKey,
    secretKey,
    onResolve,
  ]);

  return (
    <div className="text-white">
      <h1 className="mb-6 text-center text-xl">Add Exchange Account</h1>
      <div>
        <div className="flex justify-stretch gap-4">
          <ExchangeSelector
            className="basis-1/2"
            label="Exchange"
            selectedItem={exchange}
            onSelect={setExchange}
            noWisdomise
          />

          <MarketSelector
            className="basis-1/2"
            label="Market"
            selectedItem={market}
            onSelect={setMarket}
          />
        </div>
        <TextBox
          className="mt-6"
          label="Account Name"
          value={accountName}
          onChange={setAccountName}
        />
        <TextBox
          className="mt-6"
          label="API Key"
          value={apiKey}
          onChange={setApiKey}
        />
        <TextBox
          className="mt-6"
          label="Secret Key"
          value={secretKey}
          onChange={setSecretKey}
        />
      </div>

      <div className="mt-8 flex justify-center">
        <Button onClick={addHandler} loading={isSubmitting}>
          Add Account
        </Button>
      </div>
    </div>
  );
};

export default function useModalAddExchangeAccount(): [
  JSX.Element,
  () => Promise<string | undefined>,
] {
  const [Modal, showModal] = useModal(ModalAddExchangeAccount);
  return [Modal, async () => (await showModal({})) as string | undefined];
}
