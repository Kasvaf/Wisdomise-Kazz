import { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useCountdown } from 'usehooks-ts';
import { Steps } from 'antd';
import Card from 'shared/Card';
import { type SubscriptionPlan } from 'api/types/subscription';
import ImportTokenButton from 'modules/account/PageToken/ImportTokenButton';
import { useLockingRequirementQuery } from 'api/defi';
import { useVipAccessFlow } from 'modules/account/PageBilling/useVipAccessFlow';
import { Button } from 'shared/v1-components/Button';
import { ReactComponent as WisdomiseLogo } from '../../images/wisdomise-logo.svg';
import { ReactComponent as Done } from '../../images/done.svg';
import { ReactComponent as ClockIcon } from './clock.svg';
import ConnectWalletGuard from './ConnectWalletGuard';
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
  const { data: generalLockingRequirement, refetch } =
    useLockingRequirementQuery(plan.price);

  const price =
    generalLockingRequirement?.requirement_locking_amount.toLocaleString();

  const { currentStep } = useVipAccessFlow({ planPrice: plan.price });

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
    <div className="h-dvh overflow-auto px-24 mobile:px-0">
      <Steps
        className="my-10 mobile:mb-6 mobile:px-6"
        size="small"
        current={currentStep}
        items={[
          {
            title: 'Login',
          },
          {
            title: 'Connect Wallet',
          },
          {
            title: 'Sign Nonce',
          },
          {
            title: 'Stake',
          },
          {
            title: 'Activate VIP Access',
          },
        ]}
      />
      <div className="grid grid-cols-12 md:mt-20">
        <div className="col-span-12 flex h-full flex-col items-center justify-center lg:col-span-6">
          <div className="mb-8 mobile:w-full mobile:px-8">
            <div className="flex items-center gap-4">
              <WisdomiseLogo />
              <div>
                <p className="text-xl text-white mobile:text-base">
                  {t('token-modal.title')}
                </p>
                <div className="flex items-center gap-2">
                  <ClockIcon />
                  <span className="text-v1-content-secondary">
                    {Math.floor(count / 60)}m {count % 60}s
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-5">
              <p className="text-[40px] text-white mobile:text-3xl">{price}</p>
              <p className="text-lg mobile:text-sm">
                <Trans i18nKey="token-modal.token-name" ns="billing" />
                <br />
                <span className="text-white/50">1 Month</span>
              </p>
            </div>

            <div className="mt-6 text-3xl font-semibold">{plan.name}</div>
          </div>
        </div>
        <div className="col-span-12 flex flex-col items-center justify-center lg:col-span-6">
          {done ? (
            <Card className="flex flex-col items-center gap-6">
              <Done className="text-green-400 mobile:w-24" />
              <div className="mb-6 text-center">
                <p className="mb-6 text-2xl font-medium">
                  {t('token-modal.congratulations')}
                </p>
                <p className="font-medium text-white/60">
                  Wise Club Activated!
                </p>
              </div>

              <Button onClick={onDoneClick} className="w-full">
                {t('token-modal.done')}
              </Button>
              <ImportTokenButton className="w-full" tokenSymbol="lcWSDM" />
            </Card>
          ) : (
            <ConnectWalletGuard
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
            </ConnectWalletGuard>
          )}
        </div>
      </div>
    </div>
  );
}
