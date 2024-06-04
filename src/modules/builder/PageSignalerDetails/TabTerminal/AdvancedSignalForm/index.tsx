import { v4 } from 'uuid';
import { clsx } from 'clsx';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { type FullPosition, type SignalerData } from 'api/builder';
import Button from 'shared/Button';
import useSignalFormStates from './useSignalFormStates';
import useActionHandlers from './useActionHandlers';
import PartOpen from './PartOpen';
import PartTpSl from './PartTpSl';

interface Props {
  signaler: SignalerData;
  assetName: string;
  activePosition?: FullPosition;
  className?: string;
}

const AdvancedSignalForm: React.FC<Props> = ({
  signaler,
  assetName,
  activePosition,
  className,
}) => {
  const { t } = useTranslation('builder');
  const formState = useSignalFormStates();
  const {
    isUpdate: [isUpdate, setIsUpdate],
    hasTakeProfit: [, setHasTakeProfit],
    hasStopLosses: [, setHasStopLosses],
    takeProfits: [, setTakeProfits],
    stopLosses: [, setStopLosses],
  } = formState;

  useEffect(() => {
    setHasTakeProfit(
      !activePosition || !!activePosition.manager?.take_profit?.length,
    );
    setTakeProfits(
      activePosition?.manager?.take_profit?.map(x => ({
        key: x.applied ? x.key : v4(),
        amountRatio: x.amount_ratio * 100,
        priceExact: x.price_exact ?? 0,
        applied: x.applied ?? false,
      })) ?? [],
    );

    setIsUpdate(!!activePosition);
    setHasStopLosses(
      !activePosition || !!activePosition.manager?.stop_loss?.length,
    );
    setStopLosses(
      activePosition?.manager?.stop_loss?.map(x => ({
        key: x.applied ? x.key : v4(),
        amountRatio: x.amount_ratio * 100,
        priceExact: x.price_exact ?? 0,
        applied: x.applied ?? false,
      })) ?? [],
    );
  }, [
    activePosition,
    setIsUpdate,
    setHasTakeProfit,
    setHasStopLosses,
    setTakeProfits,
    setStopLosses,
  ]);

  const {
    isSubmitting,
    fireHandler,
    updateHandler,
    closeHandler,
    ModalConfirm,
  } = useActionHandlers({
    data: formState,
    signaler,
    assetName,
    activePosition,
  });

  // ======================================================================

  return (
    <div className={clsx('flex flex-col gap-3 px-3', className)}>
      {!isUpdate && (
        <PartOpen data={formState} signaler={signaler} assetName={assetName} />
      )}
      <PartTpSl
        type="TP"
        data={formState}
        signaler={signaler}
        assetName={assetName}
      />
      <PartTpSl
        type="SL"
        data={formState}
        signaler={signaler}
        assetName={assetName}
      />

      <div className="border-b border-white/10" />

      {isUpdate ? (
        <>
          <Button onClick={updateHandler} loading={isSubmitting}>
            {t('signal-form.btn-update')}
          </Button>
          <Button
            variant="secondary-red"
            onClick={closeHandler}
            loading={isSubmitting}
          >
            {t('signal-form.btn-close')}
          </Button>
        </>
      ) : (
        <Button onClick={fireHandler} loading={isSubmitting}>
          {t('signal-form.btn-fire-signal')}
        </Button>
      )}

      {ModalConfirm}
    </div>
  );
};

export default AdvancedSignalForm;
