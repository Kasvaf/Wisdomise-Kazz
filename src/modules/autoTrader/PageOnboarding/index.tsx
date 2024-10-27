import { useState } from 'react';
import { clsx } from 'clsx';
import { useNavigate } from 'react-router-dom';
import logo from 'assets/logo-horizontal-beta.svg';
import Button from 'shared/Button';
import { Background } from 'modules/autoTrader/TelegramAuthGuard';
import tickets from '../tickets.png';
import autoTrader from '../loading.png';
import sparkler from './sparkler.png';
import target from './target.png';
import lightBulb from './lightBulb.png';

export default function PageOnboarding() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden">
      <Background />
      <div className="relative flex h-screen flex-col items-center p-6 pb-10 text-center">
        <div className="flex w-full gap-3">
          {Array.from({ length: 2 }).map((_, index) => (
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

        {step === 0 && (
          <>
            <img
              src={autoTrader}
              className="me-4 mt-8 w-[16rem]"
              alt="tickets"
            />
            <h1 className="mt-6 font-semibold">
              Join the Autotrader Waitlist <br />
            </h1>
            <p className="my-4 text-sm">
              Welcome to Wisdomise Autotrader, where you can automate your
              trades with AI-driven insights, set precise limit orders, and stay
              ahead with real-time market updates
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
              variant="alternative"
              onClick={() => {
                setStep(1);
              }}
              className="mt-auto w-full"
            >
              Tell Me More!
            </Button>
          </>
        )}

        {step === 1 && (
          <>
            <img src={tickets} className="me-4 mt-8 w-[16rem]" alt="tickets" />
            <h1 className="mt-2 font-semibold">Claim Your Reward</h1>
            <p className="my-4 text-sm">
              Connect your wallet to claim your Silver Pool rewards! Just link
              your wallet, and any eligible rewards based on your activity will
              be transferred to you
            </p>
            <Button
              onClick={() => navigate('/hot-coins')}
              className="mt-auto w-full"
            >
              Lets Get Started!
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
