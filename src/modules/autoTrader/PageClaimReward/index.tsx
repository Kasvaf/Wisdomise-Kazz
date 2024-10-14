import { useEffect, useState } from 'react';
import { TonConnectButton, useTonConnectUI } from '@tonconnect/ui-react';
import { clsx } from 'clsx';
import { notification } from 'antd';
import Card from 'shared/Card';
import {
  type TicketType,
  useCheckEligibilityMutation,
  useFriends,
  useSyncDataMutation,
  useUserTicketsQuery,
  useWithdrawMutation,
} from 'api/gamification';
import logo from 'assets/logo-horizontal-beta.svg';
import BottomDrawer from 'modules/autoTrader/BottomDrawer';
import Button from 'shared/Button';
import { addComma } from 'utils/numbers';
import ton from './images/ton.png';
import wsdm from './images/wsdm.png';
import plat from './images/plat.png';
import gold from './images/gold.png';
import silver from './images/silver.png';
import star from './images/star.svg';

export const TON_PER_REFERRAL = 0.01;

export default function ClaimRewardPage() {
  const { data: friends } = useFriends();
  const { data, mutate: sync } = useSyncDataMutation();
  const {
    mutateAsync,
    data: eligibility,
    isLoading,
  } = useCheckEligibilityMutation();
  const [selectedTicket, setSelectedTicket] = useState<TicketType>();
  const [open, setOpen] = useState(false);
  const { data: userTickets } = useUserTicketsQuery();
  const [tonConnect] = useTonConnectUI();
  const { mutateAsync: withdraw, isLoading: withdrawIsLoading } =
    useWithdrawMutation();

  useEffect(() => {
    sync({});
  }, [sync]);

  const check = (ticketType: TicketType) => {
    setSelectedTicket(ticketType);
    void mutateAsync({ ticket_type: ticketType }).then(() => {
      setOpen(true);
      sync({});
      return null;
    });
  };

  const handleWithdraw = () => {
    void withdraw({ token: 'wsdm' }).then(() => {
      notification.success({
        message: 'Withdrawal registered! You will get your tokens in few days',
      });
      sync({});
      return null;
    });
  };

  return (
    <div className="mb-28 p-6 pt-4">
      <div className="flex items-center justify-between">
        <img className="h-6" src={logo} alt="logo" />
        {tonConnect.connected ? (
          <p className="text-xs text-white/40">
            Your WSDM balance:{' '}
            <span className="text-white">{addComma(0)} WSDM</span>
          </p>
        ) : (
          <TonConnectButton />
        )}
      </div>
      <div className="mt-6">
        <Card className="mt-3 py-3">
          <div className="flex gap-3">
            <img src={ton} alt="ton" className="h-10 w-10 scale-x-[-1]" />
            <div>
              <p className="text-xs">TON Tokens Earned</p>
              <p className="mt-2 text-xs text-white/40">
                <strong className="font-bold text-white">
                  {(data?.ton_balance ?? 0) +
                    (friends?.count ?? 0) * TON_PER_REFERRAL}
                </strong>{' '}
                until now
              </p>
            </div>
            <Button
              className="ms-auto w-36"
              size="small"
              disabled={true}
              onClick={() => check('silver_ticket')}
            >
              Coming Soon...
            </Button>
          </div>
        </Card>

        <Card className="mt-3 py-3">
          <div className="flex gap-3">
            <img src={wsdm} alt="ton" className="h-10 w-10" />
            <div>
              <p className="text-xs">WSDM Tokens Earned</p>
              <p className="mt-2 text-xs text-white/40">
                <strong className="font-bold text-white">
                  {data?.wsdm_balance ?? 0}
                </strong>{' '}
                until now
              </p>
            </div>
            <Button
              variant="tg-blue"
              size="small"
              className="ms-auto w-36"
              onClick={() => handleWithdraw()}
              loading={withdrawIsLoading}
              disabled={data?.wsdm_balance === 0 || withdrawIsLoading}
            >
              Withdraw
            </Button>
          </div>
        </Card>
      </div>

      <h1 className="mb-3 mt-8 font-semibold">WSDM Pools</h1>
      <p>
        Silver Ticket Pool Reward Size is{' '}
        <span className="font-semibold text-[#00A3FF]">$100K</span>. Check if
        you’ve won shares of the Pool. Stay tuned for Gold & Platinum Reward
        Pools coming soon!
      </p>
      <Card className="mt-3 py-3">
        <div className="flex gap-3">
          <img src={silver} alt="ton" className="h-10 w-10 scale-x-[-1]" />
          <div>
            <p className="text-xs">Silver Ticket</p>
            <p className="mt-2 text-xs text-white/40">
              Tickets Owned: {data?.tickets.silver_ticket}
            </p>
          </div>
          <Button
            variant="tg-blue"
            size="small"
            className="ms-auto w-36"
            loading={isLoading}
            onClick={() => check('silver_ticket')}
            disabled={isLoading}
          >
            Check Eligibility
          </Button>
        </div>
      </Card>

      <Card className="mt-3 py-3">
        <div className="flex gap-3">
          <img src={gold} alt="ton" className="h-10 w-10 scale-x-[-1]" />
          <div>
            <p className="text-xs">Gold Ticket</p>
            <p className="mt-2 text-xs text-white/40">
              Tickets Owned: {data?.tickets.golden_ticket}
            </p>
          </div>
          <Button
            size="small"
            className="ms-auto w-36"
            disabled={true}
            onClick={() => check('silver_ticket')}
          >
            Coming Soon...
          </Button>
        </div>
      </Card>

      <Card className="mt-3 py-3">
        <div className="flex gap-3">
          <img src={plat} alt="ton" className="h-10 w-10 scale-x-[-1]" />
          <div>
            <p className="text-xs">Platinum Ticket</p>
            <p className="mt-2 text-xs text-white/40">
              Tickets Owned: {data?.tickets.plat_ticket}
            </p>
          </div>
          <Button
            size="small"
            className="ms-auto w-36"
            disabled={true}
            onClick={() => check('silver_ticket')}
          >
            Coming Soon...
          </Button>
        </div>
      </Card>

      <BottomDrawer
        open={open}
        onClose={() => setOpen(false)}
        className="rounded-3xl"
        maskClosable={true}
      >
        <div className="flex flex-col items-center px-2 pt-8 text-center">
          <h1 className="font-bold">
            {eligibility?.[0] ? (
              <>
                <span className="text-[#00FFA3]">Congratulations!</span>
                <br />
                You’ve Got a Winning Ticket!
              </>
            ) : (
              'No Luck This Time'
            )}
          </h1>
          <p className="pb-6 pt-3">
            {eligibility?.[0]
              ? 'One of your Silver Tickets is a winner! You can now claim your rewards from the pool.'
              : 'It looks like your Silver Tickets didn’t win this round. Don’t worry, there’s always another chance! Keep going and good luck next time!'}
          </p>
          {userTickets?.[selectedTicket ?? 'silver_ticket'].map(
            (ticket, index) => (
              <Card
                key={ticket}
                className={clsx(
                  'mb-2 flex w-full items-center gap-3 border border-transparent text-xs',
                  eligibility?.[0]?.ticket_number === ticket &&
                    '!border-[#00FFA3]',
                )}
              >
                {/* fill: linear-gradient(270deg, #1D262F 43.27%, rgba(0, 134, 85, 0.00) 208.48%); */}
                <img
                  src={selectedTicket === 'silver_ticket' ? silver : ton}
                  className="h-8 w-8"
                />
                <div className="text-white/40">
                  <span>
                    {index}.{' '}
                    {selectedTicket === 'silver_ticket' ? 'Silver Ticket' : ''}
                  </span>
                </div>
                <div className="rounded bg-[#28323E] px-1">ID: {ticket}</div>
                {eligibility?.[0]?.ticket_number === ticket && (
                  <div className="ms-auto flex gap-2 text-[#00FFA3]">
                    <img src={star} />
                    <span>Winner</span>
                  </div>
                )}
              </Card>
            ),
          )}
        </div>
        <Button
          variant="tg-blue"
          className="fixed bottom-10 end-6 start-6"
          onClick={() => setOpen(false)}
        >
          Claim Reward
        </Button>
      </BottomDrawer>
    </div>
  );
}
