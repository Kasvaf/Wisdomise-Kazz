import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { type FullPosition, type SignalerData } from 'api/builder';
import Button from 'shared/Button';
import { type SignalFormState } from './useSignalFormStates';
import useActionHandlers from './useActionHandlers';
import useSyncFormState from './useSyncFormState';
import PartSafetyOpen from './PartSafetyOpen';
import PartOpen from './PartOpen';
import PartTpSl from './PartTpSl';

interface Props {
  signaler: SignalerData;
  assetName: string;
  activePosition?: FullPosition;
  formState: SignalFormState;
  className?: string;
}

const AdvancedSignalForm: React.FC<Props> = ({
  signaler,
  assetName,
  activePosition,
  formState,
  className,
}) => {
  const { t } = useTranslation('builder');
  const {
    isUpdate: [isUpdate],
  } = formState;

  useSyncFormState({
    formState,
    assetName,
    activePosition,
  });

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
    <div className={clsx('flex flex-col gap-3 px-3 mobile:px-0', className)}>
      {!isUpdate && (
        <PartOpen data={formState} signaler={signaler} assetName={assetName} />
      )}
      <PartSafetyOpen
        data={formState}
        signaler={signaler}
        assetName={assetName}
      />
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
