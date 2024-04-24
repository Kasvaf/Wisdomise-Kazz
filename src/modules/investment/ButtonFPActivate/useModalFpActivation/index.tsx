import { Steps } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateFPIMutation, useInvestorAssetStructuresQuery } from 'api';
import {
  type FinancialProduct,
  type MarketTypes,
} from 'api/types/financialProduct';
import useModal from 'shared/useModal';
import { type FinancialProductInstance } from 'api/types/investorAssetStructure';
import useModalDisclaimer from './useModalDisclaimer';
import StepChooseWallet from './StepChooseWallet';
import StepConfirm from './StepConfirm';
import StepDone from './StepDone';

const ModalFpActivation: React.FC<{
  financialProduct: FinancialProduct;
  onResolve?: (account?: string) => void;
}> = ({ financialProduct: fp }) => {
  const [step, setStep] = useState(0);
  const [wallet, setWallet] = useState<string>();
  const [fpi, setFpi] = useState<FinancialProductInstance>();

  const navigate = useNavigate();

  const [ModalDisclaimer, openDisclaimer] = useModalDisclaimer();
  const createFPI = useCreateFPIMutation();
  const ias = useInvestorAssetStructuresQuery();
  const hasIas = Boolean(ias.data?.[0]?.main_exchange_account);
  const createFP = async () => {
    if (wallet !== 'wisdomise' || hasIas || (await openDisclaimer())) {
      const account = !wallet || wallet === 'wisdomise' ? undefined : wallet;
      const fpi = await createFPI.mutateAsync({ fpKey: fp.key, account });
      setFpi(fpi);
      setStep(2);
    }
  };

  const gotoFpiDetails = () => {
    if (fpi?.key) {
      navigate('/investment/assets/' + fpi?.key);
    }
  };

  const fpiLen = ias.data?.[0].financial_product_instances.length;
  useEffect(() => {
    if (!wallet || !fpiLen) {
      setStep(0);
    }
  }, [fpiLen, wallet]);

  return (
    <div>
      <h1 className="mb-9 text-center text-2xl">{fp.title}</h1>
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
          onContinue={() => setStep(1)}
        />
      )}

      {step === 1 && wallet && (
        <StepConfirm
          financialProduct={fp}
          wallet={wallet}
          onBack={() => setStep(0)}
          onContinue={createFP}
        />
      )}

      {step === 2 && fpi && (
        <StepDone financialProductInstance={fpi} onContinue={gotoFpiDetails} />
      )}

      {ModalDisclaimer}
    </div>
  );
};

export default function useModalFpActivation(): [
  JSX.Element,
  (p: { financialProduct: FinancialProduct }) => Promise<string | undefined>,
] {
  const [Modal, showModal] = useModal(ModalFpActivation, {
    width: 750,
    introStyle: true,
  });
  return [
    Modal,
    async (p: { market?: MarketTypes; financialProduct: FinancialProduct }) =>
      (await showModal(p)) as string | undefined,
  ];
}
