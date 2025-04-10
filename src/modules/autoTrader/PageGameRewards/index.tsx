import { useEffect, useState } from 'react';
import { useTonAddress, useTonConnectUI } from '@tonconnect/ui-react';
import { clsx } from 'clsx';
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
import Button from 'shared/Button';
import { addComma } from 'utils/numbers';
import { DrawerModal } from 'shared/DrawerModal';
import ton from 'modules/shared/NetworkIcon/ton.svg';
import usdt from './images/usdt.svg';
import plat from './images/plat.png';
import gold from './images/gold.png';
import silver from './images/silver.png';
// eslint-disable-next-line import/max-dependencies
import star from './images/star.svg';

export const TON_PER_REFERRAL = 0.01;

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
        <p className="mb-6 text-xs text-white/40">
          Your USDT balance in your wallet:{' '}
          <span className="text-white">{addComma(usdtBalance)} USDT</span>
        </p>
      )}
      <div className="rounded-xl bg-v1-surface-l2 px-2 py-3">
        <div className="flex items-center gap-3">
          <img src={ton} alt="ton" className="ms-2 h-8 w-8" />
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
      </div>

      <div className="mt-3 rounded-xl bg-v1-surface-l2 px-2 py-3">
        <div className="flex items-center gap-3">
          <img src={usdt} alt="ton" className="ms-2 h-8 w-8" />
          <div>
            <p className="text-xs">USDT Tokens Earned</p>
            <p className="mt-2 text-xs text-white/40">
              <strong className="font-bold text-white">{usdtReward}</strong>{' '}
              until now
            </p>
            <div className="mt-3 text-xxs text-white/40">
              Should be at least 10 USDT to withdraw
            </div>
          </div>
          <Button
            variant="brand"
            size="small"
            className="ms-auto min-w-36"
            onClick={() => handleWithdraw()}
            loading={withdrawIsLoading}
            disabled={usdtReward < 10 || withdrawIsLoading}
          >
            Withdraw
          </Button>
        </div>
      </div>

      <h1 className="mb-3 mt-8 font-semibold">Reward Pools</h1>
      <p>
        Check if you’ve won shares of the pool. Stay tuned for gold & platinum
        reward pools coming soon!
      </p>
      <div className="mt-3 rounded-xl bg-v1-surface-l2 px-2 py-3">
        <div className="flex gap-3">
          <img src={silver} alt="ton" className="h-10 w-10 scale-x-[-1]" />
          <div>
            <p className="text-xs">Silver Ticket</p>
            <p className="mt-2 text-xs text-white/40">
              Tickets Owned: {data?.tickets.silver_ticket}
            </p>
          </div>
          <Button
            variant="brand"
            size="small"
            className="ms-auto w-36"
            loading={isLoading}
            onClick={() => check('silver_ticket')}
            disabled={isLoading}
          >
            Check Eligibility
          </Button>
        </div>
      </div>

      <div className="mt-3 rounded-xl bg-v1-surface-l2 px-2 py-3">
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
      </div>

      <div className="mt-3 rounded-xl bg-v1-surface-l2 px-2 py-3">
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
      </div>

      <DrawerModal
        open={open}
        onClose={() => setOpen(false)}
        destroyOnClose
        className="max-w-lg mobile:!h-[30rem] mobile:max-w-full"
        maskClosable={true}
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
          <p className="pb-6 pt-3">
            {eligibility?.[0]
              ? 'You can now claim your rewards from the pool.'
              : 'It looks like your Silver Tickets didn’t win.'}
          </p>
          {userTickets?.[selectedTicket ?? 'silver_ticket']?.map(
            (ticket, index) => (
              <div
                key={ticket}
                className={clsx(
                  'mb-2 flex w-full items-center gap-3 rounded-xl border border-transparent bg-v1-surface-l2 p-2 text-xs',
                  isWinnerTicket(ticket) && '!border-v1-border-positive',
                )}
                style={{
                  background: isWinnerTicket(ticket)
                    ? 'linear-gradient(270deg, #1D262F 43.27%, rgba(0, 134, 85, 0.00) 208.48%)'
                    : '',
                }}
              >
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
                <div className="rounded bg-v1-surface-l3 px-2 py-px">
                  ID: {ticket}
                </div>
                {isWinnerTicket(ticket) && (
                  <div className="me-2 ms-auto flex gap-2 text-v1-content-positive">
                    <img src={star} />
                    <span>Winner</span>
                  </div>
                )}
              </div>
            ),
          )}
        </div>
        <Button
          variant="brand"
          className="absolute bottom-10 end-4 start-4"
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
        >
          {eligibility?.[0]?.status === 'winner' ? 'Claim' : 'Done'}
        </Button>
      </DrawerModal>
    </>
  );
}
