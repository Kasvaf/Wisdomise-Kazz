import { useCallback, useMemo, useState } from 'react';
import { clsx } from 'clsx';
import Card from 'shared/Card';
import Button from 'shared/Button';
import { type SubscriptionPlan } from 'api/types/subscription';
import { ReactComponent as LogoWithText } from 'assets/logo-horizontal-beta.svg';
import ConnectWalletWrapper from 'modules/account/PageBilling/tokenPayment/ConnectWalletWrapper';
import { INVESTMENT_FE } from 'config/constants';
import { addComma } from 'utils/numbers';
import { useAccountQuery, useSubmitTokenPayment } from 'api';
import { ReactComponent as WisdomiseLogo } from '../images/wisdomise-logo.svg';
import { ReactComponent as Done } from '../images/done.svg';

interface Props {
  plan: SubscriptionPlan;
  onResolve: () => void;
}

export default function TokenPaymentModalContent({ plan }: Props) {
  const { data: account } = useAccountQuery();
  const { mutateAsync } = useSubmitTokenPayment();
  const [done, setDone] = useState(false);
  const openInvestmentPanel = useCallback(() => {
    window.location.href = INVESTMENT_FE;
  }, []);

  const canSubscribe = useMemo(
    () => plan.wsdm_token_hold < (account?.wsdm_balance ?? 0),
    [plan, account],
  );

  const submitTokenPayment = async () => {
    await mutateAsync({
      amount_paid: 0,
      subscription_plan_key: plan.key,
    });
    setDone(true);
  };

  const onDoneClick = async () => {
    window.location.reload();
  };

  return (
    <div className="grid h-screen grid-cols-12 overflow-auto text-white">
      <div className="col-span-12 flex h-full flex-col items-center justify-center bg-[#131822] lg:col-span-6">
        <div className="w-3/4 mobile:w-full mobile:px-8 mobile:py-12">
          <div className="flex items-center gap-3 mobile:hidden">
            <div className="h-10 w-10 rounded-full bg-[#D9D9D9]" />
            <p className="text-xl text-white">Wisdomise AG</p>
          </div>

          <LogoWithText className="hidden mobile:block" />

          <p className="mt-14 text-xl text-white/50 mobile:mt-10">
            Subscribe to {plan.name}
          </p>

          <div className="mt-6 flex items-center gap-5">
            <p className="text-[40px] text-white mobile:text-3xl">
              {addComma(plan.wsdm_token_hold)}
            </p>
            <p className="text-lg mobile:text-sm">
              Wisdomise Token (tWSDM)
              <br />
              <span className="text-white/50">For 1 year</span>
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
                    {addComma(plan.wsdm_token_hold)} tWSDM
                  </span>
                </div>
                <p className="mt-6 text-sm text-white/50 mobile:mt-4">
                  {plan.description}
                </p>
              </div>

              <div className="flex justify-between gap-4 border-b border-white/20">
                <span>Subtotal</span>
                <span className="whitespace-nowrap">
                  {addComma(plan.wsdm_token_hold)} tWSDM
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-sm">
                  Total amount need to be hold in your wallet
                </span>
                <span className="whitespace-nowrap">
                  {addComma(plan.wsdm_token_hold)} tWSDM
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-12 flex flex-col items-center justify-center bg-white/5 lg:col-span-6">
        {done ? (
          <Card className="flex flex-col items-center gap-12">
            <Done className="mobile:w-24" />
            <div className="text-center">
              <p className="mb-6 text-2xl font-medium">Congratulations!</p>
              <p className="font-medium text-white/60">
                you can now access {plan.name} Features.
              </p>
            </div>

            <Button onClick={onDoneClick}>Done</Button>
          </Card>
        ) : (
          <ConnectWalletWrapper className="mobile:m-4 lg:w-3/4">
            <Card className="flex flex-col items-center gap-6 text-center">
              <h3>Wisdomise Pro</h3>
              <div className="flex items-center justify-center gap-10">
                <div>
                  <div className="mb-5 text-4xl">
                    {addComma(plan.wsdm_token_hold)}
                  </div>
                  <div className="text-sm opacity-50">
                    Wisdomise Token (tWSDM)
                  </div>
                </div>
                <div className="h-16 w-px border-r border-white/50"></div>
                <div>
                  <div
                    className={clsx(
                      'mb-5 text-4xl',
                      canSubscribe ? 'text-green-400' : 'text-red-400',
                    )}
                  >
                    {account?.wsdm_balance ?? 0}
                  </div>
                  <div className="text-sm opacity-50">
                    Your tWSDM Token Balance
                  </div>
                </div>
              </div>
              <Card className="!bg-black/80">
                <p className="text-sm text-white/80">
                  Your Wisdomise Tokens will not be deducted, you will only need
                  to hold the tokens in your wallet for a the subscription
                  period in order to gain access.
                </p>
              </Card>
              <div className="max-w-[18rem]">
                <Button
                  onClick={submitTokenPayment}
                  disabled={!canSubscribe}
                  className="mb-6 w-full"
                >
                  Activate Subscription
                </Button>
                <Button
                  disabled={canSubscribe}
                  className="w-full"
                  onClick={openInvestmentPanel}
                >
                  Purchase Wisdomise Token
                </Button>
              </div>
            </Card>
          </ConnectWalletWrapper>
        )}
      </div>
    </div>
  );
}
