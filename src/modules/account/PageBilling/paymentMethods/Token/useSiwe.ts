import { type SiweMessage } from 'siwe';
import { useAccount, useSignMessage } from 'wagmi';
import { type NonceVerificationBody } from 'api/defi';

export default function useSignInWithEthereum() {
  const { address, chain } = useAccount();
  const { signMessageAsync, isPending } = useSignMessage();

  function createMessage(address: string, statement: string, nonce: string) {
    const messageParams: Partial<SiweMessage> = {
      domain: window.location.host,
      address,
      statement,
      nonce,
      uri: window.location.origin,
      version: '1',
      chainId: chain?.id,
      issuedAt: new Date().toISOString(),
    };
    return messageParams;
  }

  async function signInWithEthereum(
    nonce: string,
  ): Promise<NonceVerificationBody | null> {
    if (!address || !nonce) return null;
    const statement =
      'Wisdomise wants you to sign in with your Ethereum account';
    const message = createMessage(address, statement, nonce);
    const preMessage = toMessage(message);
    return {
      message: {
        ...message,
        chain_id: message.chainId,
        issued_at: message.issuedAt,
      },
      signature: await signMessageAsync({
        message: preMessage,
      }),
    };
  }

  return { signInWithEthereum, isPending };
}

function toMessage(message: Partial<SiweMessage>): string {
  /** Validates all fields of the object */

  const header = `${
    message.domain ?? ''
  } wants you to sign in with your Ethereum account:`;
  const uriField = `URI: ${message.uri ?? ''}`;
  let prefix = [header, message.address].join('\n');
  const versionField = `Version: ${message.version ?? ''}`;

  // if (!message.nonce) {
  //   this.nonce = generateNonce();
  // }

  const chainField = 'Chain ID: ' + (String(message.chainId) ?? '');

  const nonceField = `Nonce: ${message.nonce ?? ''}`;

  const suffixArray = [uriField, versionField, chainField, nonceField];

  message.issuedAt = message.issuedAt || new Date().toISOString();

  suffixArray.push(`Issued At: ${message.issuedAt}`);

  if (message.expirationTime) {
    const expiryField = `Expiration Time: ${message.expirationTime}`;

    suffixArray.push(expiryField);
  }

  if (message.notBefore) {
    suffixArray.push(`Not Before: ${message.notBefore}`);
  }

  if (message.requestId) {
    suffixArray.push(`Request ID: ${message.requestId}`);
  }

  if (message.resources) {
    suffixArray.push(
      ['Resources:', ...message.resources.map(x => `- ${x}`)].join('\n'),
    );
  }

  const suffix = suffixArray.join('\n');
  prefix = [prefix, message.statement].join('\n\n');
  if (message.statement) {
    prefix += '\n';
  }
  return [prefix, suffix].join('\n');
}
