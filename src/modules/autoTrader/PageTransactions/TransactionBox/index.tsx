import dayjs from 'dayjs';
import { bxsRightArrow } from 'boxicons-quasar';
import {
  type TransactionOrder,
  type TransactionClose,
  type TransactionDeposit,
  type TransactionWithdraw,
  type TransactionOpenClose,
  type Transaction,
  type Position,
} from 'api';
import Icon from 'shared/Icon';
import { roundSensible } from 'utils/numbers';
import { ReactComponent as WithdrawIcon } from './withdraw.svg';
import { ReactComponent as DepositIcon } from './deposit.svg';
import { AssetIcon, Box, GasFee, StatusLabel, TonViewer } from './components';

const AssetPrice: React.FC<{
  assetName: string;
  assetSlug: string;
  amount: number | string | null | undefined;
}> = ({ assetName, assetSlug, amount }) => {
  return (
    <div className="flex shrink-0 items-center">
      {roundSensible(amount)} {assetName}
      <AssetIcon slug={assetSlug} className="ml-1" />
    </div>
  );
};

const TransactionAnyOrderBox: React.FC<{
  t: TransactionOpenClose | TransactionOrder;
  p: Position;
}> = ({ t, p }) => {
  const price = t.data.price_usd;
  const isQuoteFirst = t.type === 'open' || t.type === 'safety_open';
  const totalPrice =
    +price * Number(isQuoteFirst ? t.data.to_amount : t.data.from_amount);

  return (
    <Box
      title={
        {
          stop_loss: 'Stop Loss', // token -> quote
          take_profit: 'Take Profit', // token -> quote
          safety_open: 'Safety Open', // quote -> token
          open: 'Open', // quote -> token
          close: 'Close', // token -> quote
        }[t.type] +
        ('index' in t.data && Number(t.data.index)
          ? ' #' + String(t.data.index)
          : '')
      }
      info={<StatusLabel t={t} />}
      contentClassName="flex flex-col items-stretch gap-3"
    >
      <div className="flex items-center justify-between">
        <AssetPrice
          assetName={t.data.from_asset_name}
          assetSlug={t.data.from_asset_slug}
          amount={t.data.from_amount}
        />
        <div className="mx-4 flex grow items-center">
          <div className="flex w-full justify-center border-b border-dashed border-v1-content-secondary">
            {!!+price && Number.isFinite(totalPrice) && (
              <div className="h-0 -translate-y-[7px] overflow-visible text-xs">
                <div className="bg-v1-surface-l2 px-1 text-white/70">
                  {roundSensible(totalPrice)} $
                </div>
              </div>
            )}
          </div>
          <Icon
            name={bxsRightArrow}
            size={8}
            className="text-v1-content-secondary"
          />
        </div>
        <AssetPrice
          assetName={t.data.to_asset_name}
          assetSlug={t.data.to_asset_slug}
          amount={t.data.to_amount}
        />
      </div>

      <GasFee t={t} />
      <TonViewer link={t.data.link} network={p.network_slug} />
    </Box>
  );
};

const TransactionDepositWithdrawBox: React.FC<{
  t: TransactionWithdraw | TransactionDeposit;
  p: Position;
}> = ({ t, p }) => {
  return (
    <Box
      title={t.type === 'withdraw' ? 'Withdraw' : 'Deposit'}
      info={<StatusLabel t={t} />}
    >
      {t.data.assets.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            {t.data.assets.map(a => (
              <AssetPrice
                key={a.asset_slug}
                assetName={a.asset_name}
                assetSlug={a.asset_slug}
                amount={a.amount}
              />
            ))}
          </div>
          {t.type === 'withdraw' ? <WithdrawIcon /> : <DepositIcon />}
        </div>
      )}

      {t.type === 'withdraw' && t.data.gas_fee_amount && (
        <GasFee t={t} className="mt-3" />
      )}

      {t.data.link && <TonViewer link={t.data.link} network={p.network_slug} />}
    </Box>
  );
};

const TransactionCloseBox: React.FC<{ t: TransactionClose; p: Position }> = ({
  t,
}) => {
  return <Box title="Closed" info={dayjs(t.data.time).fromNow()} />;
};

const TransactionBox: React.FC<{ t: Transaction; p: Position }> = ({
  t,
  p,
}) => {
  switch (t.type) {
    case 'stop_loss':
    case 'take_profit':
    case 'safety_open':
    case 'open':
    case 'close': {
      return <TransactionAnyOrderBox t={t} p={p} />;
    }

    case 'deposit':
    case 'withdraw': {
      return <TransactionDepositWithdrawBox t={t} p={p} />;
    }

    case 'close_event': {
      return <TransactionCloseBox t={t} p={p} />;
    }

    default: {
      return null;
    }
  }
};

export default TransactionBox;
