import * as Sentry from '@sentry/react';
import { Connection } from '@solana/web3.js';
import { projectId } from 'config/appKit';
import type React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

const chainId = 'solana';
const clusterPublicKey = '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp'; // mainnet-beta
const rpc = `rpc.walletconnect.org/v1/?chainId=${chainId}:${clusterPublicKey}&projectId=${projectId}`;
const httpsRpc = `https://${rpc}`;
const wsRpc = `https://${rpc}`;

const backupRpc =
  'https://young-old-tree.solana-mainnet.quiknode.pro/ca99ef43426d07e0838047552f4ad5fe58a1dd6a/';

const context = createContext<Connection | null>(null);

export const useSolanaConnection = () => {
  const conn = useContext(context);
  if (!conn) throw new Error('Missing SolanaConnectionProvider');
  return conn;
};

export const SolanaConnectionProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [connection, setConnection] = useState(
    new Connection(httpsRpc, { commitment: 'confirmed', wsEndpoint: wsRpc }),
  );

  useEffect(() => {
    void (async () => {
      try {
        await connection.getEpochInfo();
      } catch {
        Sentry.captureException('Primary RPC failed, switching backup');
        const backup = new Connection(backupRpc, 'confirmed');
        try {
          await backup.getEpochInfo();
          setConnection(backup);
        } catch {
          Sentry.captureException('Backup RPC failed');
        }
      }
    })();
  }, [connection]);

  return <context.Provider value={connection}>{children}</context.Provider>;
};
