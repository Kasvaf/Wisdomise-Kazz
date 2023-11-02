/* eslint-disable import/max-dependencies */
import type React from 'react';
import { useNavigate } from 'react-router-dom';
import { notification } from 'antd';
import { useInvestorAssetStructuresQuery, useCreateFPIMutation } from 'api';
import { useIsVerified } from 'api/kyc';
import { type FinancialProduct } from 'api/types/financialProduct';
import { isProduction } from 'utils/version';
import Button from 'shared/Button';
import useModalExchangeAccountSelector from 'modules/account/useModalExchangeAccountSelector';
import useModalVerification from '../useModalVerification';
import useModalApiKey from './useModalApiKey';
import useModalDisclaimer from './useModalDisclaimer';
import useEnsureSubscription from './useEnsureSubscription';

interface Props {
  inDetailPage?: boolean;
  className?: string;
  financialProduct: FinancialProduct;
}

const ButtonActivate: React.FC<Props> = ({
  className,
  financialProduct: fp,
}) => {
  const navigate = useNavigate();
  const createFPI = useCreateFPIMutation();
  const ias = useInvestorAssetStructuresQuery();
  const hasIas = Boolean(ias.data?.[0]?.main_exchange_account);
  const market =
    (fp.config.can_use_external_account &&
      fp.config.external_account_market_type) ||
    undefined;

  const gotoDashboardHandler = () => {
    navigate('/app/assets');
    notification.destroy(fp.key);
  };

  const activateProduct = async (account?: string) => {
    await createFPI.mutateAsync({ fpKey: fp.key, account });
    notification.success({
      key: fp.key,
      message: 'Congratulations!',
      description: (
        <>
          <p>
            Thank you for trusting us. You can now deposit any amount to your
            account and activate any of the AI-powered strategies
          </p>

          <div className="mt-4 flex justify-around">
            <Button
              size="small"
              variant="primary"
              onClick={gotoDashboardHandler}
            >
              Dashboard
            </Button>
          </div>
        </>
      ),
      duration: 0,
    });
  };

  const fpis = ias.data?.[0]?.financial_product_instances;
  const isOtherFPActive =
    (fpis?.length || 0) > 0 && fp?.key !== fpis?.[0]?.financial_product.key;

  const [ModalExchangeAccountSelector, showModalExchangeAccountSelector] =
    useModalExchangeAccountSelector();
  const [ModalVerification, openVerification] = useModalVerification();
  const [ModalDisclaimer, openDisclaimer] = useModalDisclaimer();
  const [ModalApiKey, showModalApiKey] = useModalApiKey();
  const [SubscribeModal, ensureSubscribed] = useEnsureSubscription();
  const isVerified = useIsVerified();

  const onActivateClick = async () => {
    if (!(await ensureSubscribed())) return;

    if (isVerified.isLoading) return;
    if (!isVerified.isAllVerified) {
      if (await openVerification()) {
        navigate('/account/kyc');
      }
      return;
    }

    if (fp.config.no_withdraw) {
      await showModalApiKey({});
      return;
    }

    const acc = isProduction
      ? 'wisdomise'
      : await showModalExchangeAccountSelector({ market });
    if (!acc) return;

    if (acc !== 'wisdomise' || hasIas || (await openDisclaimer())) {
      await activateProduct(!acc || acc === 'wisdomise' ? undefined : acc);
    }
  };

  return (
    <>
      <Button
        variant="primary"
        className={className}
        onClick={onActivateClick}
        loading={createFPI.isLoading}
        disabled={isOtherFPActive || !fp.subscribable}
      >
        Activate
      </Button>

      {SubscribeModal}
      {ModalVerification}
      {ModalExchangeAccountSelector}
      {ModalDisclaimer}
      {ModalApiKey}
    </>
  );
};

export default ButtonActivate;
