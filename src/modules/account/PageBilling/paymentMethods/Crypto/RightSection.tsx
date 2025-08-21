import { useInvoicesQuery } from 'api';
import type { Network } from 'api/types/NetworksResponse';
import type { SubscriptionPlan } from 'api/types/subscription';
import { clsx } from 'clsx';
import NetworkSelector from 'modules/account/wallet/useCryptoNetworkSelector/NetworkSelector';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from 'shared/Button';
import CoinsIcons from 'shared/CoinsIcons';
import CopyInputBox from 'shared/CopyInputBox';
import { useBoolean } from 'usehooks-ts';
import { ReactComponent as MailIcon } from '../../images/mail.svg';
import SubmitTransactionID from './SubmitTransactionID';

interface Props {
  invoiceKey?: string;
  plan: SubscriptionPlan;
  onResolve: VoidFunction;
}

export default function RightSection({ plan, onResolve, invoiceKey }: Props) {
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
    <div className="flex h-full shrink grow basis-0 items-center justify-center bg-white/5 mobile:bg-v1-background-primary">
      <div
        className={clsx(
          'flex w-3/4 flex-col items-center gap-10 rounded-3xl bg-white/5 px-8 py-12',
          'mobile:w-full mobile:rounded-b-none mobile:bg-[#343942] mobile:px-6 mobile:py-8',
          isSubmitted && 'hidden',
        )}
      >
        <p className="font-medium mobile:text-base text-white text-xl">
          {t('crypto-modal.payment-by-crypto')}
        </p>

        <div className="rounded-3xl bg-black/80 px-4 py-6 text-center mobile:text-xs text-white/60">
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
              <p className="font-medium text-xs">Tether</p>
              <p className="text-white/40 text-xxs">USDT</p>
            </div>
          </div>
          <div className="basis-3/5">
            <NetworkSelector
              networks={networkItems}
              onSelect={setNetwork}
              selectedItem={network}
            />
          </div>
        </div>

        <div className="w-full">
          <p className="pb-2 pl-4 text-sm">Wallet</p>
          <div className="flex items-center justify-between">
            <CopyInputBox className="w-full" style="alt" value={network.key} />
          </div>
        </div>

        {isConfirmed ? (
          <SubmitTransactionID
            invoiceKey={invoiceKey}
            network={network}
            onSubmitSuccess={setSubmitted}
            plan={plan}
          />
        ) : (
          <Button onClick={setConfirmed}>
            {t('crypto-modal.btn-confirm')}
          </Button>
        )}
      </div>

      <div
        className={clsx(
          'hidden w-3/4 flex-col items-center gap-14 rounded-3xl bg-white/5 px-8 py-12',
          'mobile:w-full mobile:gap-10 mobile:rounded-b-none mobile:bg-[#343942] mobile:px-6 mobile:py-8',
          isSubmitted && '!flex',
        )}
      >
        <MailIcon className="mobile:w-24" />
        <div className="text-center">
          <p className="mb-6 font-medium text-2xl">
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
