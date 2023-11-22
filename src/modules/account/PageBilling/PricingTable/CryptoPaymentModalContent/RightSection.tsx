import { clsx } from 'clsx';
import { useState } from 'react';
import { useBoolean } from 'usehooks-ts';
import { useTranslation } from 'react-i18next';
import type { Network } from 'api/types/NetworksResponse';
import Button from 'modules/shared/Button';
import CoinsIcons from 'modules/shared/CoinsIcons';
import NetworkSelector from 'modules/wallet/useCryptoNetworkSelector/NetworkSelector';
import { type SubscriptionPlan } from 'api/types/subscription';
import { useInvoicesQuery } from 'api';
import CopyInputBox from 'modules/shared/CopyInputBox';
import { ReactComponent as MailIcon } from '../../images/mail.svg';
import SubmitTransactionID from './SubmitTransactionID';

interface Props {
  plan: SubscriptionPlan;
  onResolve: () => void;
}

export default function RightSection({ plan, onResolve }: Props) {
  const { t } = useTranslation('billing');
  const invoices = useInvoicesQuery();
  const [network, setNetwork] = useState<Network>(networkItems[0]);
  const { value: isConfirmed, setTrue: setConfirmed } = useBoolean();
  const { value: isSubmitted, setTrue: setSubmitted } = useBoolean();

  const onDoneClick = async () => {
    await invoices.refetch();
    onResolve();
  };

  return (
    <div className="flex h-full shrink grow basis-0 items-center justify-center bg-white/5 mobile:bg-[#131822]">
      <div
        className={clsx(
          'flex w-3/4 flex-col items-center gap-10 rounded-3xl bg-white/5 px-8 py-12 ',
          'mobile:w-full mobile:rounded-b-none mobile:bg-[#343942] mobile:px-6 mobile:py-8',
          isSubmitted && 'hidden',
        )}
      >
        <p className="text-xl font-medium text-white mobile:text-base">
          {t('crypto-modal.payment-by-crypto')}
        </p>

        <div className="rounded-3xl bg-black/80 px-4 py-6 text-center text-white/60 mobile:text-xs">
          {isConfirmed
            ? t('crypto-modal.notice.confirmed')
            : t('crypto-modal.notice.is-not-confirmed')}
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
          <p className="pb-2 pl-4 text-sm">Wallet</p>
          <div className="flex items-center justify-between">
            <CopyInputBox style="alt" className="w-full" value={network.key} />
          </div>
        </div>

        {isConfirmed ? (
          <SubmitTransactionID
            plan={plan}
            network={network}
            onSubmitSuccess={setSubmitted}
          />
        ) : (
          <Button onClick={setConfirmed}>
            {t('crypto-modal.btn-confirm')}
          </Button>
        )}
      </div>

      <div
        className={clsx(
          'hidden w-3/4 flex-col items-center gap-14 rounded-3xl bg-white/5 px-8 py-12 ',
          'mobile:w-full mobile:gap-10 mobile:rounded-b-none mobile:bg-[#343942] mobile:px-6 mobile:py-8',
          isSubmitted && '!flex',
        )}
      >
        <MailIcon className="mobile:w-24" />
        <div className="text-center">
          <p className="mb-6 text-2xl font-medium">
            {t('crypto-modal.check-mail.title')}
          </p>
          <p className="font-medium text-white/60">
            {t('crypto-modal.check-mail.description')}
          </p>
        </div>

        <Button loading={invoices.isRefetching} onClick={onDoneClick}>
          {t('crypto-modal.btn-done')}
        </Button>
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
