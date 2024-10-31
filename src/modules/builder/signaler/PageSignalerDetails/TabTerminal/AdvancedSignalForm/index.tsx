import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { notification } from 'antd';
import { type FullPosition } from 'api/builder';
import Button from 'shared/Button';
import { useHasFlag } from 'api';
import { useUserStorage } from 'api/userStorage';
import { type SignalFormState } from './useSignalFormStates';
import useActionHandlers from './useActionHandlers';
import useSyncFormState from './useSyncFormState';
import PartSafetyOpen from './PartSafetyOpen';
import PartOpen from './PartOpen';
import PartTpSl from './PartTpSl';

interface Props {
  assetName: string;
  activePosition?: FullPosition;
  formState: SignalFormState;
  className?: string;
}

const AdvancedSignalForm: React.FC<Props> = ({
  assetName,
  activePosition,
  formState,
  className,
}) => {
  const { t } = useTranslation('builder');
  const hasFlag = useHasFlag();
  const [tonConnectUI] = useTonConnectUI();
  const {
    isUpdate: [isUpdate],
  } = formState;

  useSyncFormState({
    formState,
    assetName,
    activePosition,
  });

  const {
    isEnabled,
    isSubmitting,
    fireHandler,
    updateHandler,
    closeHandler,
    ModalConfirm,
  } = useActionHandlers({
    data: formState,
    assetName,
    activePosition,
  });

  const userStorage = useUserStorage('auto-trader-waitlist', 'false');

  const joinWaitList = async () => {
    void userStorage.save('true').then(() => {
      notification.success({
        message: (
          <p>
            <strong className="font-bold">You’ve joined the waitlist!</strong>{' '}
            We’ll notify you when it’s your turn to activate.
          </p>
        ),
        description: '',
      });
      return null;
    });
  };

  // ======================================================================

  return (
    <div className={clsx('flex flex-col gap-3 px-3 mobile:px-0', className)}>
      <div className="flex flex-col gap-5">
        <PartOpen data={formState} assetName={assetName} />
        <PartSafetyOpen data={formState} assetName={assetName} />
        <PartTpSl type="TP" data={formState} assetName={assetName} />
        <PartTpSl type="SL" data={formState} assetName={assetName} />
      </div>

      {isUpdate ? (
        <>
          <Button
            variant="brand"
            onClick={updateHandler}
            loading={isSubmitting}
            disabled={!isEnabled}
          >
            {t('signal-form.btn-update')}
          </Button>
          <Button
            variant="secondary-red"
            onClick={closeHandler}
            loading={isSubmitting}
            disabled={!isEnabled}
          >
            {t('signal-form.btn-close')}
          </Button>
        </>
      ) : hasFlag('/open-position') ? (
        tonConnectUI.connected ? (
          <Button
            variant="brand"
            onClick={fireHandler}
            loading={isSubmitting}
            disabled={!isEnabled}
          >
            {t('signal-form.btn-fire-signal')}
          </Button>
        ) : (
          <Button variant="brand" onClick={() => tonConnectUI.openModal()}>
            Connect Wallet
          </Button>
        )
      ) : (
        <div>
          <Button
            variant="brand"
            loading={userStorage.isLoading}
            disabled={userStorage.value === 'true'}
            className="w-full"
            onClick={() => joinWaitList()}
          >
            {userStorage.value === 'true'
              ? 'Already Joined Waitlist'
              : 'Join Waitlist'}
          </Button>
        </div>
      )}

      {ModalConfirm}
    </div>
  );
};

export default AdvancedSignalForm;
