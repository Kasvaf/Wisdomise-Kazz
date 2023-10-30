import { useCallback, useState } from 'react';
import { notification } from 'antd';
import { type ExchangeTypes, useCreateExchangeAccount } from 'api';
import { type MarketTypes } from 'api/types/financialProduct';
import { unwrapErrorMessage } from 'utils/error';
import useModal from 'shared/useModal';
import TextBox from 'shared/TextBox';
import Button from 'shared/Button';
import LabelInfo from 'modules/shared/LabelInfo';
import Banner from 'modules/shared/Banner';
import ExchangeSelector from './ExchangeSelector';
import MarketSelector from './MarketSelector';

const emptyFieldError = 'This field may not be blank.';
const createApiKeyHelp =
  'https://www.binance.com/en-BH/support/faq/how-to-create-api-360002502072';

const ModalAddExchangeAccount: React.FC<{
  fixedMarket?: MarketTypes;
  onResolve?: (account?: string) => void;
}> = ({ fixedMarket, onResolve }) => {
  const [showErrors, setShowErrors] = useState(false);
  const [exchange, setExchange] = useState<ExchangeTypes>('BINANCE');
  const [market, setMarket] = useState<MarketTypes>(fixedMarket || 'SPOT');
  const [accountName, setAccountName] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [secretKey, setSecretKey] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const createAccount = useCreateExchangeAccount();

  const addHandler = useCallback(async () => {
    setShowErrors(true);
    if (!accountName || !apiKey || !secretKey) return;

    try {
      setIsSubmitting(true);
      const acc = await createAccount({
        title: accountName,
        exchange_name: exchange,
        market_name: market,
        api_key: apiKey,
        secret_key: secretKey,
      });

      setShowErrors(false);
      setAccountName('');
      setApiKey('');
      setSecretKey('');

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
            disabled={Boolean(fixedMarket)}
          />
        </div>
        <TextBox
          className="mt-6"
          label="Account Name"
          value={accountName}
          onChange={setAccountName}
          error={showErrors && !accountName && emptyFieldError}
        />
        <TextBox
          className="mt-6"
          label={<LabelInfo url={createApiKeyHelp}>API KEY</LabelInfo>}
          value={apiKey}
          onChange={setApiKey}
          error={showErrors && !apiKey && emptyFieldError}
        />
        <TextBox
          className="mt-6"
          label={<LabelInfo url={createApiKeyHelp}>Secret Key</LabelInfo>}
          value={secretKey}
          onChange={setSecretKey}
          error={showErrors && !secretKey && emptyFieldError}
        />
      </div>

      <Banner className="mt-8">
        <div className="mb-2 text-white/80">
          Use following values for{' '}
          <code className="text-white">IP access restrictions</code> in Binance:
        </div>
        <ul className="ml-4 list-disc">
          <li>13.39.30.245</li>
          <li>13.36.152.59</li>
          <li>13.36.112.70</li>
          <li>15.188.188.103</li>
        </ul>
      </Banner>

      <div className="mt-8 flex justify-center">
        <Button onClick={addHandler} loading={isSubmitting}>
          Add Account
        </Button>
      </div>
    </div>
  );
};

export default function useModalAddExchangeAccount(
  market?: MarketTypes,
): [JSX.Element, () => Promise<string | undefined>] {
  const [Modal, showModal] = useModal(ModalAddExchangeAccount);
  return [
    Modal,
    async () =>
      (await showModal({ fixedMarket: market })) as string | undefined,
  ];
}
