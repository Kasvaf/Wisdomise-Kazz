import { clusterApiUrl, Connection } from '@solana/web3.js';
import { projectId } from 'config/appKit';

const chainId = 'solana';
const clusterPublicKey = '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp'; // mainnet-beta
const primaryRpc = `https://rpc.walletconnect.org/v1/?chainId=${chainId}:${clusterPublicKey}&projectId=${projectId}`;

const backupRpc = clusterApiUrl('mainnet-beta');

let connection = new Connection(primaryRpc, 'confirmed');

export function getConnection() {
  return connection;
}

async function checkConnectionHealth() {
  try {
    await connection.getEpochInfo();
    return true;
  } catch {
    console.warn('Primary RPC failed, switching to backup RPC');
    return false;
  }
}

async function initConnection() {
  const isHealthy = await checkConnectionHealth();
  if (!isHealthy) {
    connection = new Connection(backupRpc, 'confirmed');
  }

  try {
    await connection.getEpochInfo();
  } catch (error) {
    console.error('Backup RPC failed', error);
  }
}

void (await initConnection());
