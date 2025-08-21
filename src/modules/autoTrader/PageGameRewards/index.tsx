import { useTonAddress, useTonConnectUI } from '@tonconnect/ui-react';
import { notification } from 'antd';
import { useAccountJettonBalance } from 'api/chains/ton';
import {
  type TicketType,
  useCheckEligibilityMutation,
  useGameFriendsQuery,
  useSyncDataMutation,
  useUserTicketsQuery,
  useWithdrawMutation,
} from 'api/gamification';
import { clsx } from 'clsx';
import ton from 'modules/shared/NetworkIcon/ton.svg';
import { useEffect, useState } from 'react';
import Button from 'shared/Button';
import { DrawerModal } from 'shared/DrawerModal';
import { addComma } from 'utils/numbers';
import gold from './images/gold.png';
import plat from './images/plat.png';
import silver from './images/silver.png';
import star from './images/star.svg';
import usdt from './images/usdt.svg';

const TON_PER_REFERRAL = 0.01;

export default function PageGameRewards() {
  const address = useTonAddress();
  const { data: friends } = useGameFriendsQuery();
  const { data, mutate: sync } = useSyncDataMutation();
  const {
    mutateAsync,
    data: eligibility,
    isPending: isLoading,
  } = useCheckEligibilityMutation();
  const [selectedTicket, setSelectedTicket] = useState<TicketType>();
  const [open, setOpen] = useState(false);
  const { data: userTickets } = useUserTicketsQuery();
  const [tonConnect] = useTonConnectUI();
  const { mutateAsync: withdraw, isPending: withdrawIsLoading } =
    useWithdrawMutation();
  const { data: usdtBalance } = useAccountJettonBalance('tether');
  const usdtReward =
    data?.user_attributes?.find(att => att.attribute === 'usdt_balance')
      ?.value ?? 0;

  useEffect(() => {
    sync({});
  }, [sync]);

  const isWinnerTicket = (ticket: number) => {
    return eligibility?.map(el => el.ticket_number).includes(ticket);
  };

  const check = (ticketType: TicketType) => {
    if (address) {
      setSelectedTicket(ticketType);
      void mutateAsync({ ticket_type: ticketType }).then(() => {
        setOpen(true);
        sync({});
        return null;
      });
    } else {
      notification.error({
        message: 'Please connect your wallet',
      });
    }
  };

  const handleWithdraw = () => {
    void withdraw({ token: 'usdt' }).then(() => {
      notification.success({
        message:
          'Withdrawal registered! You will get your tokens within 72 hours.',
      });
      sync({});
      return null;
    });
  };

  // already wrapped in PageWrapper in GameAuthGuard
  return (
    <>
      {tonConnect.connected && usdtBalance != null && (
        <p className="mb-6 text-white/40 text-xs">
          Your USDT balance in your wallet:{' '}
          <span className="text-white">{addComma(usdtBalance)} USDT</span>
        </p>
      )}
      <div className="rounded-xl bg-v1-surface-l2 px-2 py-3">
        <div className="flex items-center gap-3">
          <img alt="ton" className="ms-2 h-8 w-8" src={ton} />
          <div>
            <p className="text-xs">TON Tokens Earned</p>
            <p className="mt-2 text-white/40 text-xs">
              <strong className="font-bold text-white">
                {(data?.ton_balance ?? 0) +
                  (friends?.count ?? 0) * TON_PER_REFERRAL}
              </strong>{' '}
              until now
            </p>
          </div>
          <Button
            className="ms-auto w-36"
            disabled={true}
            onClick={() => check('silver_ticket')}
            size="small"
          >
            Coming Soon...
          </Button>
        </div>
      </div>

      <div className="mt-3 rounded-xl bg-v1-surface-l2 px-2 py-3">
        <div className="flex items-center gap-3">
          <img alt="ton" className="ms-2 h-8 w-8" src={usdt} />
          <div>
            <p className="text-xs">USDT Tokens Earned</p>
            <p className="mt-2 text-white/40 text-xs">
              <strong className="font-bold text-white">{usdtReward}</strong>{' '}
              until now
            </p>
            <div className="mt-3 text-white/40 text-xxs">
              Should be at least 10 USDT to withdraw
            </div>
          </div>
          <Button
            className="ms-auto min-w-36"
            disabled={usdtReward < 10 || withdrawIsLoading}
            loading={withdrawIsLoading}
            onClick={() => handleWithdraw()}
            size="small"
            variant="brand"
          >
            Withdraw
          </Button>
        </div>
      </div>

      <h1 className="mt-8 mb-3 font-semibold">Reward Pools</h1>
      <p>
        Check if you’ve won shares of the pool. Stay tuned for gold & platinum
        reward pools coming soon!
      </p>
      <div className="mt-3 rounded-xl bg-v1-surface-l2 px-2 py-3">
        <div className="flex gap-3">
          <img alt="ton" className="h-10 w-10 scale-x-[-1]" src={silver} />
          <div>
            <p className="text-xs">Silver Ticket</p>
            <p className="mt-2 text-white/40 text-xs">
              Tickets Owned: {data?.tickets.silver_ticket}
            </p>
          </div>
          <Button
            className="ms-auto w-36"
            disabled={isLoading}
            loading={isLoading}
            onClick={() => check('silver_ticket')}
            size="small"
            variant="brand"
          >
            Check Eligibility
          </Button>
        </div>
      </div>

      <div className="mt-3 rounded-xl bg-v1-surface-l2 px-2 py-3">
        <div className="flex gap-3">
          <img alt="ton" className="h-10 w-10 scale-x-[-1]" src={gold} />
          <div>
            <p className="text-xs">Gold Ticket</p>
            <p className="mt-2 text-white/40 text-xs">
              Tickets Owned: {data?.tickets.golden_ticket}
            </p>
          </div>
          <Button
            className="ms-auto w-36"
            disabled={true}
            onClick={() => check('silver_ticket')}
            size="small"
          >
            Coming Soon...
          </Button>
        </div>
      </div>

      <div className="mt-3 rounded-xl bg-v1-surface-l2 px-2 py-3">
        <div className="flex gap-3">
          <img alt="ton" className="h-10 w-10 scale-x-[-1]" src={plat} />
          <div>
            <p className="text-xs">Platinum Ticket</p>
            <p className="mt-2 text-white/40 text-xs">
              Tickets Owned: {data?.tickets.plat_ticket}
            </p>
          </div>
          <Button
            className="ms-auto w-36"
            disabled={true}
            onClick={() => check('silver_ticket')}
            size="small"
          >
            Coming Soon...
          </Button>
        </div>
      </div>

      <DrawerModal
        className="mobile:!h-[30rem] max-w-lg mobile:max-w-full"
        destroyOnClose
        maskClosable={true}
        onClose={() => setOpen(false)}
        open={open}
      >
        <div className="flex flex-col items-center text-center">
          <h1 className="-mt-5 font-bold">
            {eligibility?.[0] ? (
              <>
                <span className="text-v1-content-positive">
                  Congratulations!
                </span>
                <br />
                You Won!
              </>
            ) : (
              'No Luck This Time'
            )}
          </h1>
          <p className="pt-3 pb-6">
            {eligibility?.[0]
              ? 'You can now claim your rewards from the pool.'
              : 'It looks like your Silver Tickets didn’t win.'}
          </p>
          {userTickets?.[selectedTicket ?? 'silver_ticket']?.map(
            (ticket, index) => (
              <div
                className={clsx(
                  'mb-2 flex w-full items-center gap-3 rounded-xl border border-transparent bg-v1-surface-l2 p-2 text-xs',
                  isWinnerTicket(ticket) && '!border-v1-border-positive',
                )}
                key={ticket}
                style={{
                  background: isWinnerTicket(ticket)
                    ? 'linear-gradient(270deg, #1D262F 43.27%, rgba(0, 134, 85, 0.00) 208.48%)'
                    : '',
                }}
              >
                <img
                  className="h-8 w-8"
                  src={selectedTicket === 'silver_ticket' ? silver : ton}
                />
                <div className="text-white/40">
                  <span>
                    {index}.{' '}
                    {selectedTicket === 'silver_ticket' ? 'Silver Ticket' : ''}
                  </span>
                </div>
                <div className="rounded bg-v1-surface-l3 px-2 py-px">
                  ID: {ticket}
                </div>
                {isWinnerTicket(ticket) && (
                  <div className="ms-auto me-2 flex gap-2 text-v1-content-positive">
                    <img src={star} />
                    <span>Winner</span>
                  </div>
                )}
              </div>
            ),
          )}
        </div>
        <Button
          className="absolute start-4 end-4 bottom-10"
          onClick={() => {
            setOpen(false);
            if (eligibility?.[0]?.status === 'winner') {
              notification.success({
                message: 'You claimed your reward.',
              });
            } else if (
              eligibility?.[0]?.status === 'claimed' &&
              usdtReward >= 10
            ) {
              notification.success({
                message: 'You can withdraw your reward.',
              });
            }
          }}
          variant="brand"
        >
          {eligibility?.[0]?.status === 'winner' ? 'Claim' : 'Done'}
        </Button>
      </DrawerModal>
    </>
  );
}
