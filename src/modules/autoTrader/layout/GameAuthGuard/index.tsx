import { type PropsWithChildren, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { isLocal } from 'utils/version';
import { useGameLoginQuery } from 'api';
import PageWrapper from 'modules/base/PageWrapper';
import { useTelegram } from '../TelegramProvider';
import WalletGuard from './WalletGuard';

export default function GameAuthGuard({ children }: PropsWithChildren) {
  const { webApp } = useTelegram();
  const client = useQueryClient();
  const query = import.meta.env.VITE_CUSTOM_QUERY;
  const [show, setShow] = useState(false);

  const { data: isLoggedIn, refetch } = useGameLoginQuery(
    isLocal ? query : webApp?.initData,
  );

  useEffect(() => {
    void client.invalidateQueries(['gameLogin']).then(() => setShow(true));
    return () => {
      void client.invalidateQueries(['miniAppLogin']);
    };
  }, [refetch, client]);

  return (
    <PageWrapper loading={!isLoggedIn}>
      {isLoggedIn && show && <WalletGuard>{children}</WalletGuard>}
    </PageWrapper>
  );
}
