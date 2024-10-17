import { useTonAddress, useTonConnectUI } from '@tonconnect/ui-react';
import { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import { useNavigate } from 'react-router-dom';
import { notification } from 'antd';
import logo from 'assets/logo-horizontal-beta.svg';
import Button from 'shared/Button';
import { useWaitlistMutation } from 'api/gamification';
import { Background } from 'modules/autoTrader/TelegramAuthGuard';
import tickets from '../tickets.png';
import check from '../check.svg';
import sparkler from './sparkler.png';
import target from './target.png';
import lightBulb from './lightBulb.png';

export default function PageWaitlist() {
  const [tonConnect] = useTonConnectUI();
  const address = useTonAddress(true);
  const [step, setStep] = useState(0);
  const { mutateAsync, isLoading } = useWaitlistMutation();
  const navigate = useNavigate();

  const joinWaitList = async () => {
    await mutateAsync();
    notification.success({
      message: (
        <p>
          <strong className="font-bold">Success!</strong> You’ve joined the
          waitlist. We’ll notify you when Autotrader is ready.
        </p>
      ),
      description: '',
    });
    navigate('/claim-reward');
  };

  useEffect(() => {
    if (address) {
      setStep(2);
    }
  }, [address]);

  useEffect(() => {
    tonConnect.onModalStateChange(state => {
      if (state.status === 'opened') {
        setStep(1);
      }
    });
  }, [tonConnect]);

  return (
    <div className="relative overflow-hidden">
      <Background />
      <div className="relative flex h-screen flex-col items-center p-6 pb-10 text-center">
        <div className="flex w-full gap-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className={clsx(
                index <= step && '!bg-white',
                'h-1 grow rounded-full bg-white/10',
              )}
            ></div>
          ))}
        </div>
        <img src={logo} className="mt-8 h-8" alt="logo" />
        <img src={tickets} className="me-4 mt-8 w-[16rem]" alt="tickets" />

        {(step === 0 || step === 1) && (
          <>
            <h1 className="mt-6 font-semibold">
              Join the Autotrader Waitlist <br /> & Claim Your First
            </h1>
            <p className="my-4 text-sm">
              Connect your wallet to{' '}
              <strong className="font-semibold">claim rewards</strong> and
              access Wisdomise Autotrader’s{' '}
              <strong className="font-semibold">automated trading</strong>{' '}
              features.
            </p>
            <div className="flex flex-wrap justify-center gap-1 text-sm">
              <div
                className="flex items-center gap-1 rounded-3xl px-3 py-1"
                style={{
                  background:
                    'linear-gradient(91deg, rgba(255, 255, 255, 0.40) -7.03%, rgba(255, 255, 255, 0.20) 113.62%)',
                }}
              >
                <img className="h-8 w-8" src={sparkler} alt="insight" />
                AI-driven Insights
              </div>
              <div
                className="flex items-center gap-1 rounded-3xl px-3 py-1 text-sm"
                style={{
                  background:
                    'linear-gradient(91deg, rgba(255, 255, 255, 0.40) -7.03%, rgba(255, 255, 255, 0.20) 113.62%)',
                }}
              >
                <img className="h-8 w-8" src={target} alt="insight" />
                Limit Orders
              </div>
              <div
                className="flex items-center gap-1 rounded-3xl px-3 py-1 text-sm"
                style={{
                  background:
                    'linear-gradient(91deg, rgba(255, 255, 255, 0.40) -7.03%, rgba(255, 255, 255, 0.20) 113.62%)',
                }}
              >
                <img className="h-8 w-8" src={lightBulb} alt="insight" />
                Real-time Market Updates
              </div>
            </div>
            <Button
              onClick={() => {
                void tonConnect.openModal();
                setStep(1);
              }}
              className="mt-auto w-full"
            >
              Connect Wallet
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <img src={check} className="mt-4 h-12 w-12 text-lg" />
            <h1 className="mt-2 font-semibold">
              Wallet Connected Successfully!
            </h1>
            <p className="my-4 text-sm">
              Your wallet is connected! You can now claim your rewards. Join our
              waitlist to access Wisdomise Autotrader and start automated
              trading when it launches.
            </p>
            <Button
              loading={isLoading}
              onClick={joinWaitList}
              className="mt-auto w-full"
            >
              Join Waitlist
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
