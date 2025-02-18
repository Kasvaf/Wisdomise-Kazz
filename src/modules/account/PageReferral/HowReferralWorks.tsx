import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'shared/v1-components/Button';
import { DrawerModal } from 'shared/DrawerModal';
import how from './images/how.png';

export default function HowReferralWorks() {
  const { t } = useTranslation('auth');
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        variant="link"
        className="mb-3 !p-0 !text-v1-content-link"
        onClick={() => setOpen(true)}
      >
        {t('page-referral.how.button')}
      </Button>
      <DrawerModal
        open={open}
        onClose={() => setOpen(false)}
        maskClosable={true}
        closeIcon={null}
      >
        <div className="mb-20 flex flex-col items-center">
          <h1 className="-mt-5 text-center font-bold">How Referral Works</h1>
          <ul className="mt-6 ps-4 [&>li]:mb-2 [&>li]:list-disc [&>li]:text-sm [&>p]:mb-3 [&>p]:text-xs [&>p]:text-v1-content-secondary">
            <li>Share Your Referral Code</li>
            <p>
              Use Your Unique Referral Code to Invite Friends to Join Our
              Platform.
            </p>
            <li>Friends Subscribe</li>
            <p>
              When Your Friends Purchase Any Subscription Plan, You Earn 20% of
              Their Subscription fee. Available Plans: Pro and Pro+
            </p>
            <li>Friends Trade With Auto Trader (Level 1)</li>
            <p>
              You Earn 25% of the Trading Fees Paid by Your Directly Referred
              Friends When They Use the Auto Trader.
            </p>
            <li>Friends’ Friends Trade With Auto Trader (Level 2)</li>
            <p>
              You Earn 5% of the Trading Fees Paid by Your Referred
              Friends&apos; Friends (Layer 2) When They Use the Auto Trader.
            </p>
          </ul>
          <img src={how} alt="how" className="my-3 w-2/3" />
          <div className="mt-4 w-full rounded-2xl bg-v1-surface-l5 p-4">
            <h2>Example Breakdown</h2>
            <ul className="mt-4 ps-4 text-v1-content-secondary [&>li]:mb-2 [&>li]:list-disc [&>li]:text-xs">
              <li>
                If a Referred Friend Subscribes to Pro Monthly for $10,{' '}
                <span className="text-v1-content-primary">
                  You Earn $2 (20%)
                </span>
                .
              </li>
              <li>
                If That Friend Pays $100 in Auto Trader Fees,{' '}
                <span className="text-v1-content-primary">
                  You Earn $25 (25%)
                </span>
                .
              </li>
              <li>
                If a Friend of Your Referred Friend (Layer 2) Pays $100 in Auto
                Trader Fees,{' '}
                <span className="text-v1-content-primary">
                  You Earn $5 (5%)
                </span>{' '}
                .
              </li>
            </ul>
          </div>
          <p className="mt-3">Your Rewards Will Be Paid in USDT</p>
          <Button
            variant="white"
            className="!absolute bottom-6 end-4 start-4 z-10"
            onClick={() => {
              setOpen(false);
            }}
          >
            Got it
          </Button>
          <div className="pointer-events-none absolute bottom-0 end-0 start-0 h-32 w-full  bg-gradient-to-b from-[rgba(5,1,9,0.00)] from-0% to-v1-surface-l4/80 to-75%"></div>
        </div>
      </DrawerModal>
    </>
  );
}
