import { Steps } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { type ExchangeAccount } from 'api';
import {
  type FinancialProduct,
  type MarketTypes,
} from 'api/types/financialProduct';
import useModalAddExchangeAccount from 'modules/account/useModalAddExchangeAccount';
import useModal from 'shared/useModal';
import StepChooseWallet from './StepChooseWallet';
import StepConfirm from './StepConfirm';
import StepDone from './StepDone';

const ModalFpActivation: React.FC<{
  financialProduct: FinancialProduct;
  onResolve?: (account?: string) => void;
}> = ({ financialProduct: fp }) => {
  const market =
    (fp.config.can_use_external_account &&
      fp.config.external_account_market_type) ||
    undefined;

  const [ModalAddExchange, showAddExchange] =
    useModalAddExchangeAccount(market);

  const [wallet, setWallet] = useState<ExchangeAccount>();
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const gotoFpi = () => {
    if (wallet) {
      navigate('');
    }
    return true;
  };

  useEffect(() => {
    if (!wallet) {
      setStep(0);
    }
  }, [wallet]);

  return (
    <div>
      <h1 className="mb-9 text-center text-2xl">FP Name</h1>
      <Steps
        className="mb-9"
        progressDot
        current={step}
        items={[
          { title: 'Choose Wallet' },
          { title: 'Balance Check' },
          { title: 'Start Financial Product' },
        ]}
      />

      {step === 0 && (
        <StepChooseWallet
          financialProduct={fp}
          selected={wallet}
          onSelect={setWallet}
          onAddExchange={showAddExchange}
          onContinue={() => setStep(1)}
        />
      )}

      {step === 1 && wallet && (
        <StepConfirm
          financialProduct={fp}
          wallet={wallet}
          onContinue={() => setStep(2)}
        />
      )}

      {step === 2 && <StepDone onContinue={gotoFpi} />}

      {ModalAddExchange}
    </div>
  );
};

export default function useModalFpActivation(): [
  JSX.Element,
  (p: { financialProduct: FinancialProduct }) => Promise<string | undefined>,
] {
  const [Modal, showModal] = useModal(ModalFpActivation, { width: 750 });
  return [
    Modal,
    async (p: { market?: MarketTypes; financialProduct: FinancialProduct }) =>
      (await showModal(p)) as string | undefined,
  ];
}
