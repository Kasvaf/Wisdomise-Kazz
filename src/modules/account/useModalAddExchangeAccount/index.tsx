import { useCallback, useState } from 'react';
import TextBox from 'modules/shared/TextBox';
import useModal from 'modules/shared/useModal';
import Button from 'modules/shared/Button';
import ExchangeSelector from '../ExchangeSelector';

const ModalAddExchangeAccount: React.FC<{
  onResolve?: () => void;
}> = ({ onResolve }) => {
  const [exchange, setExchange] = useState('binance');
  const [accountName, setAccountName] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [secretKey, setSecretKey] = useState('');

  const addHandler = useCallback(() => {
    onResolve?.();
  }, [onResolve]);
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
          <TextBox
            className="basis-1/2"
            label="Account Name"
            value={accountName}
            onChange={setAccountName}
          />
        </div>
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
        <Button onClick={addHandler}>Add Account</Button>
      </div>
    </div>
  );
};

export default function useModalAddExchangeAccount(): [
  JSX.Element,
  () => Promise<unknown>,
] {
  const [Modal, showModal] = useModal(ModalAddExchangeAccount);
  return [Modal, () => showModal({})];
}
