import { clsx } from 'clsx';
import { useState } from 'react';
import { useBoolean, useCopyToClipboard } from 'usehooks-ts';
import type { Network } from 'api/types/NetworksResponse';
import Button from 'modules/shared/Button';
import CoinsIcons from 'modules/shared/CoinsIcons';
import NetworkSelector from 'modules/wallet/useCryptoNetworkSelector/NetworkSelector';
import { type SubscriptionPlan } from 'api/types/subscription';
import { ReactComponent as MailIcon } from '../images/mail.svg';
import SubmitTransactionID from './SubmitTransactionID';

interface Props {
  plan: SubscriptionPlan;
  onResolve: () => void;
}

export default function RightSection({ plan, onResolve }: Props) {
  const [copiedValue, copy] = useCopyToClipboard();
  const [network, setNetwork] = useState<Network>(networkItems[0]);
  const { value: isConfirmed, setTrue: setConfirmed } = useBoolean();
  const { value: isSubmitted, setTrue: setSubmitted } = useBoolean();

  return (
    <div className="flex h-full shrink grow basis-0 items-center justify-center bg-white/5 mobile:bg-[#131822]">
      <div
        className={clsx(
          'flex w-3/4 flex-col items-center gap-10 rounded-3xl bg-white/5 px-8 py-12 mobile:w-full mobile:rounded-b-none mobile:bg-[#343942] mobile:px-6 mobile:py-8',
          isSubmitted && 'hidden',
        )}
      >
        <p className="text-xl font-medium text-white mobile:text-base">
          Payment by Crypto
        </p>

        <div className="rounded-3xl bg-black/80 px-4 py-6 text-center text-white/60 mobile:text-xs">
          {isConfirmed
            ? 'Enter the transaction ID below and we will activate and send am confirmation email within 24 hours.'
            : `To transfer via crypto, first select your coin and network, so that
              the system will give you an address where you can make the transfer.`}
        </div>

        <div
          className={clsx(
            'flex w-full items-stretch justify-between gap-4',
            isConfirmed && 'hidden',
          )}
        >
          <div className="flex grow items-center gap-2 rounded-full bg-black/40 p-3">
            <CoinsIcons coins={['USDT']} size="small" />
            <div className="flex flex-col justify-between leading-none">
              <p className="text-xs font-medium">Tether</p>
              <p className="text-xxs text-white/40">USDT</p>
            </div>
          </div>
          <div className="basis-3/5">
            <NetworkSelector
              onSelect={setNetwork}
              selectedItem={network}
              networks={networkItems}
            />
          </div>
        </div>

        <div className="w-full">
          <p className="text-sm">Wallet</p>
          <div className="mt-3 rounded-2xl bg-black/40 p-6">
            <div className="mb-2 flex items-center border-b border-white/10 pb-2">
              <p className="mr-6 border-r border-white/10 pr-6 text-xs">
                My Metamask
              </p>

              <div className="flex items-center gap-2">
                <CoinsIcons coins={['USDT']} size="small" />
                <p className="text-sm">Tether</p>
                <p className="rounded-3xl bg-white/5 px-2 py-1 text-xxs leading-none">
                  {network.name}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <p className="truncate text-sm mobile:text-xs">{network.key}</p>

              <Button
                size="small"
                // eslint-disable-next-line react/jsx-no-bind
                onClick={() => copy(network.key)}
                className="!p-2 mobile:!py-1 mobile:!text-xs"
              >
                {copiedValue ? 'Copied!' : 'Copy'}
              </Button>
            </div>
          </div>
        </div>

        {isConfirmed ? (
          <SubmitTransactionID
            plan={plan}
            network={network}
            onSubmitSuccess={setSubmitted}
          />
        ) : (
          <Button onClick={setConfirmed}>Confirm</Button>
        )}
      </div>

      <div
        className={clsx(
          'hidden w-3/4 flex-col items-center gap-14 rounded-3xl bg-white/5 px-8 py-12 mobile:w-full mobile:gap-10 mobile:rounded-b-none mobile:bg-[#343942] mobile:px-6 mobile:py-8',
          isSubmitted && '!flex',
        )}
      >
        <MailIcon className="mobile:w-24" />
        <div className="text-center">
          <p className="mb-6 text-2xl font-medium">Check Your Mail</p>
          <p className="font-medium text-white/60">
            We will check your Transaction ID and Let you know by email
          </p>
        </div>

        <Button onClick={onResolve}>Done</Button>
      </div>
    </div>
  );
}

const networkItems: Network[] = [
  {
    name: 'TRX',
    description: 'Tron (TRC20)',
    key: 'TSLh894CvZGf54fqTaHq2WxszZAG1kSJRA',
  },
  {
    name: 'ETH',
    description: 'Ethereum (ERC20)',
    key: '0xda74ac6b69ff4f1b6796cddf61fbdd4a5f68525f',
  },
];
