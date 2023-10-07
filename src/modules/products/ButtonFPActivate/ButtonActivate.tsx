/* eslint-disable import/max-dependencies */
import type React from 'react';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { notification } from 'antd';
import { useInvestorAssetStructuresQuery, useCreateFPIMutation } from 'api';
import { type FinancialProduct } from 'api/types/financialProduct';
import Button from 'shared/Button';
import { useIsVerified } from 'api/kyc';
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

  const gotoDashboardHandler = useCallback(() => {
    navigate('/app/assets');
    notification.destroy(fp.key);
  }, [navigate, fp.key]);

  const onWalletDisclaimerAccept = useCallback(async () => {
    await createFPI.mutateAsync(fp.key);
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
  }, [createFPI, fp.key, gotoDashboardHandler]);

  const fpis = ias.data?.[0]?.financial_product_instances;
  const isOtherFPActive =
    (fpis?.length || 0) > 0 && fp?.key !== fpis?.[0]?.financial_product.key;

  const [ModalVerification, openVerification] = useModalVerification();
  const [ModalDisclaimer, openDisclaimer] = useModalDisclaimer();
  const [ModalApiKey, showModalApiKey] = useModalApiKey();
  const [SubscribeModal, ensureSubscribed] = useEnsureSubscription();
  const isVerified = useIsVerified();

  const onActivateClick = useCallback(async () => {
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

    if (hasIas || (await openDisclaimer())) {
      await onWalletDisclaimerAccept();
    }
  }, [
    ensureSubscribed,
    hasIas,
    isVerified,
    navigate,
    openVerification,
    openDisclaimer,
    onWalletDisclaimerAccept,
    showModalApiKey,
    fp.config.no_withdraw,
  ]);

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
      {ModalDisclaimer}
      {ModalApiKey}
    </>
  );
};

export default ButtonActivate;
