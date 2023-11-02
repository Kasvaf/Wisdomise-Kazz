import { useCallback } from 'react';
import { SiweMessage } from 'siwe';
import { useAccount, useNetwork, useSignMessage } from 'wagmi';
import { type NonceVerificationBody } from 'api/defi';

export default function useSignInWithEthereum() {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { signMessageAsync } = useSignMessage();

  function createMessage(address: string, statement: string, nonce: string) {
    const messageParams: Partial<SiweMessage> = {
      domain: window.location.host,
      address,
      statement,
      nonce,
      uri: window.location.origin,
      version: '1',
      chainId: chain?.id,
    };
    return new SiweMessage(messageParams);
  }

  const signInWithEthereum = useCallback(
    async (nonce: string): Promise<NonceVerificationBody | null> => {
      if (!address || !nonce) return null;
      const statement =
        'Wisdomise wants you to sign in with your Ethereum account';
      const message = createMessage(address, statement, nonce);
      return {
        message,
        signature: await signMessageAsync({
          message: message.prepareMessage(),
        }),
      };
    },
    [address, signMessageAsync],
  );

  return { signInWithEthereum };
}
