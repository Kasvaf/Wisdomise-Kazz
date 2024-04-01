import { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useCountdown } from 'usehooks-ts';
import Card from 'shared/Card';
import Button from 'shared/Button';
import { type SubscriptionPlan } from 'api/types/subscription';
import { ReactComponent as LogoWithText } from 'assets/logo-horizontal-beta.svg';
import ImportTokenButton from 'modules/account/PageToken/ImportTokenButton';
import { useLockingRequirementQuery } from 'api/defi';
import { ReactComponent as WisdomiseLogo } from '../../images/wisdomise-logo.svg';
import { ReactComponent as Done } from '../../images/done.svg';
import { ReactComponent as ClockIcon } from './clock.svg';
import ConnectWalletWrapper from './ConnectWalletWrapper';
import TokenCheckout from './TokenCheckout';

interface Props {
  invoiceKey?: string;
  plan: SubscriptionPlan;
  onResolve: VoidFunction;
}

export default function TokenPaymentModalContent({
  plan,
  invoiceKey,
  onResolve,
}: Props) {
  const [done, setDone] = useState(false);
  const { t } = useTranslation('billing');
  const [count, { startCountdown }] = useCountdown({ countStart: 30 * 60 });
  const { data: lockingRequirement, refetch } = useLockingRequirementQuery(
    plan.price,
  );

  const price = lockingRequirement?.requirement_locking_amount.toLocaleString();

  useEffect(() => {
    void refetch();
    startCountdown();
  }, [startCountdown, refetch]);

  useEffect(() => {
    if (count === 0) {
      onResolve();
    }
  }, [count, onResolve]);

  const onDoneClick = async () => {
    window.location.reload();
  };

  return (
    <div className="grid h-screen grid-cols-12 overflow-auto text-white">
      <div className="col-span-12 flex h-full flex-col items-center justify-center bg-page lg:col-span-6">
        <div className="w-3/4 mobile:w-full mobile:px-8 mobile:py-12">
          <p className="text-xl text-white mobile:hidden">
            {t('token-modal.title')}
          </p>
          <div className="flex items-center gap-2">
            <ClockIcon />
            <span className="text-white/60">
              {Math.floor(count / 60)}m {count % 60}s
            </span>
          </div>

          <LogoWithText className="hidden mobile:block" />

          <p className="mt-14 text-xl text-white/50 mobile:mt-10">
            {t('token-modal.subscribe-to')} {plan.name}
          </p>

          <div className="mt-6 flex items-center gap-5">
            <p className="text-[40px] text-white mobile:text-3xl">{price}</p>
            <p className="text-lg mobile:text-sm">
              <Trans i18nKey="token-modal.token-name" ns="billing" />
              <br />
              <span className="text-white/50">
                {t('token-modal.for-1-year')}
              </span>
            </p>
          </div>

          <div className="mt-12 flex gap-6 mobile:mt-8 mobile:gap-4">
            <div className="h-14 w-14  basis-14 mobile:hidden">
              <WisdomiseLogo />
            </div>
            <div className="flex flex-col gap-7 text-lg mobile:text-base [&>*]:pb-7 mobile:[&>*]:pb-4">
              <div className="border-b border-white/20">
                <div className="flex justify-between gap-4">
                  <span>{plan.name}</span>
                  <span className="whitespace-nowrap">
                    {price} {t('token-modal.token')}
                  </span>
                </div>
                <p className="mt-6 text-sm text-white/50 mobile:mt-4">
                  {plan.description}
                </p>
              </div>

              <div className="flex justify-between gap-4 border-b border-white/20">
                <span>{t('token-modal.subtotal')}</span>
                <span className="whitespace-nowrap">
                  {price} {t('token-modal.token')}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-sm">{t('token-modal.total-amount')}</span>
                <span className="whitespace-nowrap">
                  {price} {t('token-modal.token')}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-6 rounded-2xl bg-black/30 p-4">
            <p className="mb-3 text-white/60">
              By engaging in the WSDM Tokens Lockup, you hereby consent to the
              following terms.
            </p>
            <p className="text-white/60">
              <span className="font-bold text-white">Unlock Period:</span> WSDM
              Tokens are subject to a 7-day unlock period. WSDM Tokens are fully
              withdrawable without incurring any fees.
            </p>
          </div>
        </div>
      </div>
      <div className="col-span-12 flex flex-col items-center justify-center bg-white/5 lg:col-span-6">
        {done ? (
          <Card className="flex flex-col items-center gap-6">
            <Done className="mobile:w-24" />
            <div className="mb-6 text-center">
              <p className="mb-6 text-2xl font-medium">
                {t('token-modal.congratulations')}
              </p>
              <p className="font-medium text-white/60">
                {t('token-modal.you-can', { name: plan.name })}
              </p>
            </div>

            <Button onClick={onDoneClick} className="w-full">
              {t('token-modal.done')}
            </Button>
            <ImportTokenButton
              className="w-full"
              tokenSymbol="lcWSDM"
              variant="secondary"
            />
          </Card>
        ) : (
          <ConnectWalletWrapper
            className="mobile:m-4 lg:w-3/4"
            title={t('wisdomise-token:connect-wallet.billing.title')}
            description={t(
              'wisdomise-token:connect-wallet.billing.description',
            )}
          >
            <TokenCheckout
              countdown={count}
              plan={plan}
              setDone={setDone}
              invoiceKey={invoiceKey}
            />
          </ConnectWalletWrapper>
        )}
      </div>
    </div>
  );
}
