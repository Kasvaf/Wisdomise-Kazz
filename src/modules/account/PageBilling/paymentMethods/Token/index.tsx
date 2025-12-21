import { Steps } from 'antd';
import { useVipAccessFlow } from 'modules/account/PageBilling/useVipAccessFlow';
import ImportTokenButton from 'modules/account/PageToken/ImportTokenButton';
import { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useLockingRequirementQuery } from 'services/rest/defi';
import type { SubscriptionPlan } from 'services/rest/types/subscription';
import Card from 'shared/Card';
import { Button } from 'shared/v1-components/Button';
import { useCountdown } from 'usehooks-ts';
import { ReactComponent as Done } from '../../images/done.svg';
import ConnectWalletGuard from './ConnectWalletGuard';
import { ReactComponent as ClockIcon } from './clock.svg';
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

  const { currentStep } = useVipAccessFlow();

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
    <div className="h-dvh overflow-auto px-24 max-md:px-0">
      <Steps
        className="my-10 max-md:mb-6 max-md:px-6"
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
        size="small"
      />
      <div className="grid grid-cols-12 md:mt-20">
        <div className="col-span-12 flex h-full flex-col items-center justify-center lg:col-span-6">
          <div className="mb-8 max-md:w-full max-md:px-8">
            <div className="flex items-center gap-4">
              {/* <WisdomiseLogo /> */}
              <div>
                <p className="text-white text-xl max-md:text-base">
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
              <p className="text-[40px] text-white max-md:text-3xl">{price}</p>
              <p className="text-lg max-md:text-sm">
                <Trans i18nKey="token-modal.token-name" ns="billing" />
                <br />
                <span className="text-white/50">
                  1 {plan.periodicity === 'YEARLY' ? 'Year' : 'Month'}
                </span>
              </p>
            </div>

            <div className="mt-6 font-semibold text-3xl">{plan.name}</div>
          </div>
        </div>
        <div className="col-span-12 flex flex-col items-center justify-center lg:col-span-6">
          {done ? (
            <Card className="flex w-full flex-col items-center gap-6 lg:w-3/4">
              <Done className="text-green-400 max-md:w-24" />
              <div className="mb-6 text-center">
                <p className="mb-6 font-medium text-2xl">
                  {t('token-modal.congratulations')}
                </p>
                <p className="font-medium text-v1-content-secondary">
                  Wise Club Activated!
                </p>
              </div>

              <Button className="w-full" onClick={onDoneClick}>
                {t('token-modal.done')}
              </Button>
              <ImportTokenButton className="w-full" tokenSymbol="lcWSDM" />
            </Card>
          ) : (
            <ConnectWalletGuard
              className="max-md:m-4 lg:w-3/4"
              description={t(
                'wisdomise-token:connect-wallet.billing.description',
              )}
              title={t('wisdomise-token:connect-wallet.billing.title')}
            >
              <TokenCheckout
                countdown={count}
                invoiceKey={invoiceKey}
                plan={plan}
                setDone={setDone}
              />
            </ConnectWalletGuard>
          )}
        </div>
      </div>
    </div>
  );
}
