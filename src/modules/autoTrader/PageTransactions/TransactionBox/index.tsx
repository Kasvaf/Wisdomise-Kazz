import { bxsRightArrow } from 'boxicons-quasar';
import dayjs from 'dayjs';
import type {
  Position,
  Transaction,
  TransactionClose,
  TransactionDeposit,
  TransactionOpenClose,
  TransactionOrder,
  TransactionWithdraw,
} from 'services/rest';
import Icon from 'shared/Icon';
import { roundSensible } from 'utils/numbers';
import { AssetIcon, Box, GasFee, StatusLabel, TonViewer } from './components';
import { ReactComponent as DepositIcon } from './deposit.svg';
import { ReactComponent as WithdrawIcon } from './withdraw.svg';

const AssetPrice: React.FC<{
  assetName: string;
  assetSlug: string;
  amount: number | string | null | undefined;
}> = ({ assetName, assetSlug, amount }) => {
  return (
    <div className="flex shrink-0 items-center">
      {roundSensible(amount)} {assetName}
      <AssetIcon className="ml-1" slug={assetSlug} />
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
      contentClassName="flex flex-col items-stretch gap-3"
      info={<StatusLabel t={t} />}
      title={
        {
          stop_loss: 'Stop Loss', // token -> quote
          take_profit: 'Take Profit', // token -> quote
          safety_open: 'Safety Open', // quote -> token
          open: 'Open', // quote -> token
          close: 'Close', // token -> quote
        }[t.type] +
        ('index' in t.data && Number(t.data.index)
          ? ` #${String(t.data.index)}`
          : '')
      }
    >
      <div className="flex items-center justify-between">
        <AssetPrice
          amount={t.data.from_amount}
          assetName={t.data.from_asset_name}
          assetSlug={t.data.from_asset_slug}
        />
        <div className="mx-4 flex grow items-center">
          <div className="flex w-full justify-center border-v1-content-secondary border-b border-dashed">
            {!!+price && Number.isFinite(totalPrice) && (
              <div className="-translate-y-[7px] h-0 overflow-visible text-xs">
                <div className="bg-v1-surface-l1 px-1 text-white/70">
                  {roundSensible(totalPrice)} $
                </div>
              </div>
            )}
          </div>
          <Icon
            className="text-v1-content-secondary"
            name={bxsRightArrow}
            size={8}
          />
        </div>
        <AssetPrice
          amount={t.data.to_amount}
          assetName={t.data.to_asset_name}
          assetSlug={t.data.to_asset_slug}
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
      info={<StatusLabel t={t} />}
      title={t.type === 'withdraw' ? 'Withdraw' : 'Deposit'}
    >
      {t.data.assets.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            {t.data.assets.map(a => (
              <AssetPrice
                amount={a.amount}
                assetName={a.asset_name}
                assetSlug={a.asset_slug}
                key={a.asset_slug}
              />
            ))}
          </div>
          {t.type === 'withdraw' ? <WithdrawIcon /> : <DepositIcon />}
        </div>
      )}

      {t.type === 'withdraw' && t.data.gas_fee_amount && (
        <GasFee className="mt-3" t={t} />
      )}

      {t.data.link && <TonViewer link={t.data.link} network={p.network_slug} />}
    </Box>
  );
};

const TransactionCloseBox: React.FC<{ t: TransactionClose; p: Position }> = ({
  t,
}) => {
  return <Box info={dayjs(t.data.time).fromNow()} title="Closed" />;
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
      return <TransactionAnyOrderBox p={p} t={t} />;
    }

    case 'deposit':
    case 'withdraw': {
      return <TransactionDepositWithdrawBox p={p} t={t} />;
    }

    case 'close_event': {
      return <TransactionCloseBox p={p} t={t} />;
    }

    default: {
      return null;
    }
  }
};

export default TransactionBox;
