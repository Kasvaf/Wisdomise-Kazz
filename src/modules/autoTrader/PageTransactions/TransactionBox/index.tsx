import dayjs from 'dayjs';
import { bxsRightArrow } from 'boxicons-quasar';
import {
  type TransactionOrder,
  type TransactionClose,
  type TransactionDeposit,
  type TransactionWithdraw,
  type TransactionOpenClose,
  type Transaction,
} from 'api';
import Icon from 'shared/Icon';
import { roundSensible } from 'utils/numbers';
import { ReactComponent as WithdrawIcon } from './withdraw.svg';
import { ReactComponent as DepositIcon } from './deposit.svg';
import { Box, GasFee, StatusLabel, TonViewer } from './components';

const TransactionAnyOrderBox: React.FC<{
  t: TransactionOpenClose | TransactionOrder;
}> = ({ t }) => {
  return (
    <Box
      title={
        {
          stop_loss: 'Stop Loss',
          take_profit: 'Take Profit',
          safety_open: 'Safety Open',
          open: 'Open',
          close: 'Close',
        }[t.type] +
        ('index' in t.data && Number(t.data.index)
          ? ' #' + String(t.data.index)
          : '')
      }
      info={<StatusLabel t={t} />}
      contentClassName="flex flex-col items-stretch gap-3"
    >
      <div className="flex items-center justify-between">
        <div className="shrink-0">
          {roundSensible(t.data.from_amount)} {t.data.from_asset_name}
        </div>
        <div className="mx-4 flex grow items-center">
          <div className="w-full border-b border-dashed border-v1-content-secondary" />
          <Icon
            name={bxsRightArrow}
            size={8}
            className="text-v1-content-secondary"
          />
        </div>
        <div className="shrink-0">
          {roundSensible(t.data.to_amount)} {t.data.to_asset_name}
        </div>
      </div>

      <GasFee t={t} />
      <TonViewer link={t.data.link} />
    </Box>
  );
};

const TransactionDepositWithdrawBox: React.FC<{
  t: TransactionWithdraw | TransactionDeposit;
}> = ({ t }) => {
  return (
    <Box
      title={t.type === 'withdraw' ? 'Withdraw' : 'Deposit'}
      info={<StatusLabel t={t} />}
    >
      {t.data.assets.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            {t.data.assets.map(a => (
              <div key={a.asset_slug} className="shrink-0">
                {roundSensible(a.amount)} {a.asset_name}
              </div>
            ))}
          </div>
          {t.type === 'withdraw' ? <WithdrawIcon /> : <DepositIcon />}
        </div>
      )}

      {t.type === 'withdraw' && t.data.gas_fee_amount && (
        <GasFee t={t} className="mt-3" />
      )}

      {t.data.link && <TonViewer link={t.data.link} />}
    </Box>
  );
};

const TransactionCloseBox: React.FC<{ t: TransactionClose }> = ({ t }) => {
  return <Box title="Closed" info={dayjs(t.data.time).fromNow()} />;
};

const TransactionBox: React.FC<{ t: Transaction }> = ({ t }) => {
  switch (t.type) {
    case 'stop_loss':
    case 'take_profit':
    case 'safety_open':
    case 'open':
    case 'close': {
      return <TransactionAnyOrderBox t={t} />;
    }

    case 'deposit':
    case 'withdraw': {
      return <TransactionDepositWithdrawBox t={t} />;
    }

    case 'close_event': {
      return <TransactionCloseBox t={t} />;
    }

    default: {
      return null;
    }
  }
};

export default TransactionBox;
