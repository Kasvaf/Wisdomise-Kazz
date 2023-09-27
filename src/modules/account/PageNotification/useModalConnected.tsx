import { bxCheckCircle } from 'boxicons-quasar';
import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAccountQuery } from 'api';
import Icon from 'shared/Icon';
import useConfirm from 'shared/useConfirm';

export default function useModalConnected() {
  const [Modal, showModal] = useConfirm({
    icon: <Icon name={bxCheckCircle} className="text-success" size={52} />,
    yesTitle: 'Continue',
    message: (
      <div className="flex flex-col items-center text-center">
        <h1 className="text-white">Connected successfully</h1>
        <p className="mt-4 text-slate-400">
          Your Telegram account is now synced.
        </p>
      </div>
    ),
  });

  const account = useAccountQuery();
  const modalShown = useRef(false);
  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    if (!account.data?.telegram_id) return;
    if (modalShown.current) return;
    modalShown.current = true;
    if (searchParams.get('connected')) {
      void showModal({}).then(() => setSearchParams({}, { replace: true }));
    }
  }, [account.data?.telegram_id, searchParams, showModal, setSearchParams]);
  return Modal;
}
