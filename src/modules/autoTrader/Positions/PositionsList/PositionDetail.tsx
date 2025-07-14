/* eslint-disable import/max-dependencies */
import { clsx } from 'clsx';
import dayjs from 'dayjs';
import { bxHistory } from 'boxicons-quasar';
import { NavLink } from 'react-router-dom';
import { initialQuoteDeposit, type Position } from 'api';
import Button from 'shared/Button';
import Icon from 'shared/Icon';
import NetworkIcon from 'shared/NetworkIcon';
import PriceChange from 'shared/PriceChange';
import InfoButton from 'shared/InfoButton';
import { roundSensible } from 'utils/numbers';
import { useSymbolInfo } from 'api/symbol';
import { useDiscoveryRouteMeta } from 'modules/discovery/useDiscoveryRouteMeta';
import CancelButton from './CancelButton';
import CloseButton from './CloseButton';
import StatusWidget from './StatusWidget';
import EditButton from './EditButton';
import ShareButton from './ShareButton';

const AssetName: React.FC<{ slug: string }> = ({ slug }) => {
  const { data } = useSymbolInfo(slug);
  return <>{data?.abbreviation}</>;
};

const AssetIcon: React.FC<{ slug: string; className?: string }> = ({
  slug,
  className,
}) => {
  const { data } = useSymbolInfo(slug);
  if (!data?.logo_url) return null;
  return <img src={data?.logo_url} className={clsx('size-4', className)} />;
};

const PositionDetail: React.FC<{
  position: Position;
  className?: string;
}> = ({ position, className }) => {
  const { getUrl } = useDiscoveryRouteMeta();
  const initialDeposit = initialQuoteDeposit(position);
  const isOpen = ['OPENING', 'OPEN', 'CLOSING'].includes(position.status);

  return (
    <div
      className={clsx(
        'id-position-item rounded-xl bg-v1-surface-l2 p-4 text-xs',
        className,
      )}
      key={position.key}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span className="text-white/30">#{position.id}</span>
          {!!position.mode && position.mode !== 'buy_and_sell' && (
            <span className="rounded-full bg-white/10 px-2">Swap</span>
          )}

          <NavLink
            to={getUrl({
              detail: 'coin',
              view: 'both',
              slug: position.base_slug,
            })}
          >
            {position.pair_name}
          </NavLink>
          <span className="text-white/30">on</span>
          <NetworkIcon
            network={position.network_slug}
            withTitle
            className="text-white/50"
          />
        </div>
        <PositionActions position={position} />
      </div>
      <hr className="my-4 border-white/10" />
      <div className="flex flex-col gap-4">
        <StatusWidget position={position} />

        {position.status === 'CANCELED' && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-v1-content-secondary">Deposit Status</span>
              <span>{position.deposit_status}</span>
            </div>
          </>
        )}

        {position.entry_time != null && (
          <div className="flex items-center justify-between">
            <span className="text-v1-content-secondary">Opened At</span>
            <span>{dayjs(position.entry_time).fromNow()}</span>
          </div>
        )}

        {position.exit_time != null && (
          <div className="flex items-center justify-between">
            <span className="text-v1-content-secondary">Closed At</span>
            <span>{dayjs(position.exit_time).fromNow()}</span>
          </div>
        )}

        {initialDeposit != null && (
          <div className="flex items-center justify-between">
            <span className="text-v1-content-secondary">Initial Deposit</span>
            <span className="flex items-center">
              {initialDeposit} {position.quote_name}
              <AssetIcon slug={position.quote_slug} className="ml-1" />
            </span>
          </div>
        )}

        {isOpen &&
          position.current_assets
            .filter(x => !x.is_gas_fee)
            .map(a => (
              <div
                key={a.asset_slug}
                className="flex items-center justify-between"
              >
                <span className="flex items-center text-v1-content-secondary">
                  Current <AssetName slug={a.asset_slug} />
                  <AssetIcon slug={a.asset_slug} className="ml-1" />
                </span>
                <span>{roundSensible(a.amount)}</span>
              </div>
            ))}

        {isOpen &&
          position.current_assets
            .filter(x => x.is_gas_fee)
            .map(a => (
              <div
                key={a.asset_slug}
                className="flex items-center justify-between"
              >
                <span className="flex items-center gap-1 text-v1-content-secondary">
                  Gas Reserve
                  <InfoButton
                    size={16}
                    title="Remaining Gas Fee"
                    text="This gas amount is temporarily held and any unused gas will be refunded when the position is closed."
                  />
                </span>
                <span className="flex items-center">
                  {roundSensible(a.amount)} <AssetName slug={a.asset_slug} />
                  <AssetIcon slug={a.asset_slug} className="ml-1" />
                </span>
              </div>
            ))}

        {position.pnl != null && position.mode === 'buy_and_sell' && (
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-v1-content-secondary">
              P / L
              <InfoButton
                size={16}
                title="Profit and Loss"
                text="P/L represents the ratio of your profits to losses, excluding any gas fees incurred."
              />
            </span>
            <span>
              <PriceChange value={Number(position.pnl)} />
            </span>
          </div>
        )}

        {isOpen && Number(position.current_total_usd_equity) > 0 && (
          <div className="flex items-center justify-between">
            <span>Current Value</span>
            <span>{roundSensible(position.current_total_usd_equity)}$</span>
          </div>
        )}

        {position.status === 'CLOSED' && !!position.final_quote_amount && (
          <>
            <div className="flex items-center justify-between">
              <span>Withdrawn Amount</span>

              {position.mode === 'buy_and_hold' ? (
                <span className="flex items-center">
                  {roundSensible(position.current_assets?.[0]?.amount)}{' '}
                  {position.current_assets?.[0]?.asset_name}
                  <AssetIcon
                    slug={position.current_assets?.[0]?.asset_slug}
                    className="ml-1"
                  />
                </span>
              ) : (
                <span className="flex items-center">
                  {roundSensible(position.final_quote_amount)}{' '}
                  {position.quote_name}
                  <AssetIcon slug={position.quote_slug} className="ml-1" />
                </span>
              )}
            </div>
            {position.mode !== 'buy_and_sell' &&
              initialDeposit != null &&
              !!position.current_assets?.[0]?.amount && (
                <div className="flex items-center justify-between">
                  <span>Swap Price</span>
                  <span className="flex items-center">
                    {roundSensible(
                      position.mode === 'buy_and_hold'
                        ? initialDeposit / +position.current_assets[0].amount
                        : +position.current_assets[0].amount / initialDeposit,
                    )}
                  </span>
                </div>
              )}
          </>
        )}

        {position.status !== 'CANCELED' && (
          <Button
            variant="link"
            className="!p-0 !text-xs text-v1-content-link"
            contentClassName="!text-v1-content-link"
            to={`/trader/bot/${position.base_slug}/transactions?key=${position.key}`}
            size="small"
          >
            <Icon name={bxHistory} size={16} className="mr-1" />
            Transactions History
          </Button>
        )}
      </div>
    </div>
  );
};

export const PositionActions: React.FC<{
  position: Position;
}> = ({ position }) => {
  return (
    <div className="flex items-center gap-3">
      <CancelButton position={position} />
      <CloseButton position={position} />
      <EditButton position={position} />
      <ShareButton position={position} />
    </div>
  );
};

export default PositionDetail;
