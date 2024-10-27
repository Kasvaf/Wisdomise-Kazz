import { useEffect, useState } from 'react';
import {
  TonConnectButton,
  useTonAddress,
  useTonConnectUI,
} from '@tonconnect/ui-react';
import { clsx } from 'clsx';
import { notification } from 'antd';
import {
  type TicketType,
  useAccountJettonBalance,
  useCheckEligibilityMutation,
  useFriends,
  useSyncDataMutation,
  useUserTicketsQuery,
  useWithdrawMutation,
} from 'api/gamification';
import logo from 'assets/logo-horizontal-beta.svg';
import Button from 'shared/Button';
import { addComma } from 'utils/numbers';
import { DrawerModal } from 'shared/DrawerModal';
import { isProduction } from 'utils/version';
import ton from './images/ton.png';
import wsdm from './images/wsdm.png';
import plat from './images/plat.png';
import gold from './images/gold.png';
import silver from './images/silver.png';
import star from './images/star.svg';

export const TON_PER_REFERRAL = 0.01;

export default function ClaimRewardPage() {
  const address = useTonAddress();
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
  const { data: accountJettonBalance } = useAccountJettonBalance();

  useEffect(() => {
    sync({});
  }, [sync]);

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
    void withdraw({ token: 'wsdm' }).then(() => {
      notification.success({
        message:
          'Withdrawal registered! You will get your tokens in a few days',
      });
      sync({});
      return null;
    });
  };

  return (
    <div className="mb-28 p-6 pt-4">
      <div className="flex items-center justify-between">
        <img className="h-8" src={logo} alt="logo" />
        <TonConnectButton />
      </div>
      <div className="mt-6">
        {tonConnect.connected && (
          <p className="mb-6 text-xs text-white/40">
            Your WSDM balance in your wallet:{' '}
            <span className="text-white">
              {addComma(Number(accountJettonBalance?.balance ?? 0) / 10 ** 6)}{' '}
              WSDM
            </span>
          </p>
        )}
        <div className="mt-3 rounded-xl bg-v1-surface-l2 px-2 py-3">
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
        </div>

        <div className="mt-3 rounded-xl bg-v1-surface-l2 px-2 py-3">
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
              variant="brand"
              size="small"
              className="ms-auto w-36"
              onClick={() => handleWithdraw()}
              loading={withdrawIsLoading}
              disabled={
                isProduction ||
                (data?.wsdm_balance ?? 0) === 0 ||
                withdrawIsLoading
              }
            >
              Withdraw
            </Button>
          </div>
        </div>
      </div>

      <h1 className="mb-3 mt-8 font-semibold">WSDM Pools</h1>
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
            disabled={isProduction || isLoading}
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
          {userTickets?.[selectedTicket ?? 'silver_ticket']?.map(
            (ticket, index) => (
              <div
                key={ticket}
                className={clsx(
                  'mb-2 flex w-full items-center gap-3 rounded-xl border border-transparent bg-v1-surface-l2 p-2 text-xs',
                  eligibility?.[0]?.ticket_number === ticket &&
                    '!border-v1-border-positive',
                )}
                style={{
                  background:
                    eligibility?.[0]?.ticket_number === ticket
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
                {eligibility?.[0]?.ticket_number === ticket && (
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
                message: `You claimed ${
                  eligibility?.[0].reward ?? 0
                } WSDM. You can withdraw it now`,
              });
            }
          }}
        >
          {eligibility?.[0]?.status === 'winner' ? 'Claim' : 'Done'}
        </Button>
      </DrawerModal>
    </div>
  );
}
