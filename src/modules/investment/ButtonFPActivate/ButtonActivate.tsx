/* eslint-disable import/max-dependencies */
import type React from 'react';
import { useTranslation } from 'react-i18next';
import {
  useHasFlag,
  useAccountQuery,
  useInvestorAssetStructuresQuery,
} from 'api';
import { type FinancialProduct } from 'api/types/financialProduct';
import { trackClick } from 'config/segment';
import Button from 'shared/Button';
import useModalApiKey from './useModalApiKey';
import useModalFpWaitList from './useModalFpWaitList';
import useEnsureSubscription from './useEnsureSubscription';

interface Props {
  inDetailPage?: boolean;
  className?: string;
  financialProduct: FinancialProduct;
  onCreate: () => void;
}

const ButtonActivate: React.FC<Props> = ({
  className,
  financialProduct: fp,
  onCreate,
}) => {
  const { t } = useTranslation('products');
  const account = useAccountQuery();
  const ias = useInvestorAssetStructuresQuery();

  const fpis = ias.data?.[0]?.financial_product_instances;
  const isOtherFPActive =
    (fpis?.length || 0) > 0 && fp?.key !== fpis?.[0]?.financial_product.key;

  const [ModalApiKey, showModalApiKey] = useModalApiKey();
  const [ModalFpWaitList, showModalFpWaitList] = useModalFpWaitList();
  const [SubscribeModal, ensureSubscribed] = useEnsureSubscription(fp);

  const hasFlag = useHasFlag();
  const onActivateClick = async () => {
    if (!hasFlag('?activate-no-wait') && fp.owner.key !== account.data?.key) {
      await showModalFpWaitList();
      return;
    }

    trackClick('activate_strategy_button')();
    if (!(await ensureSubscribed())) return;

    if (fp.config.no_withdraw) {
      await showModalApiKey({});
      return;
    }

    onCreate();
  };

  return (
    <>
      <Button
        variant="primary"
        className={className}
        onClick={onActivateClick}
        disabled={isOtherFPActive || !fp.subscribable}
      >
        {t('actions.activate')}
      </Button>

      {ModalFpWaitList}
      {SubscribeModal}
      {ModalApiKey}
    </>
  );
};

export default ButtonActivate;
