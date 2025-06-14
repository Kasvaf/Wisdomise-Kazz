import { Connection } from '@solana/web3.js';
import * as Sentry from '@sentry/react';
import { projectId } from 'config/appKit';

const chainId = 'solana';
const clusterPublicKey = '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp'; // mainnet-beta
const primaryRpc = `https://rpc.walletconnect.org/v1/?chainId=${chainId}:${clusterPublicKey}&projectId=${projectId}`;

const backupRpc =
  'https://young-old-tree.solana-mainnet.quiknode.pro/ca99ef43426d07e0838047552f4ad5fe58a1dd6a/';

let connection = new Connection(primaryRpc, 'confirmed');

export function getConnection() {
  return connection;
}

async function checkConnectionHealth() {
  try {
    await connection.getEpochInfo();
    return true;
  } catch {
    Sentry.captureException('Primary RPC failed, switching to backup RPC');
    return false;
  }
}

function initConnection() {
  void checkConnectionHealth().then(async isHealthy => {
    if (!isHealthy) {
      connection = new Connection(backupRpc, 'confirmed');
      try {
        await connection.getEpochInfo();
      } catch {
        Sentry.captureException('Backup RPC failed');
      }
    }
    return null;
  });
}

initConnection();
