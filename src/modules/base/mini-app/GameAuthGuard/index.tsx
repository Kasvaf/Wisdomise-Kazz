import { type PropsWithChildren, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useGameLoginQuery } from 'api';
import { isLocal } from 'utils/version';
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

  // biome-ignore lint/correctness/useExhaustiveDependencies: <reason>
  useEffect(() => {
    void client
      .invalidateQueries({ queryKey: ['gameLogin'] })
      .then(() => setShow(true));
    return () => {
      void client.invalidateQueries({ queryKey: ['miniAppLogin'] });
    };
  }, [refetch, client]);

  return (
    <PageWrapper hasBack loading={!isLoggedIn}>
      {isLoggedIn && show && <WalletGuard>{children}</WalletGuard>}
    </PageWrapper>
  );
}
