import { useCallback, useState } from 'react';
import TextBox from 'modules/shared/TextBox';
import useModal from 'modules/shared/useModal';
import Button from 'modules/shared/Button';

const ModalAddExchangeAccount: React.FC<{
  onResolve?: () => void;
}> = ({ onResolve }) => {
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
        <TextBox
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
