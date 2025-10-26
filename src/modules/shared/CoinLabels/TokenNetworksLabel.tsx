import type { CoinNetwork } from 'api/discovery';
import { bxNetworkChart } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { ClickableTooltip } from 'shared/ClickableTooltip';
import { ContractAddress } from 'shared/ContractAddress';
import Icon from 'shared/Icon';

export function TokenNetworksLabel({
  className,
  value,
  size,
  clickable,
}: {
  className?: string;
  value?: CoinNetwork[] | null;
  size: 'xs' | 'sm' | 'md';
  clickable?: boolean;
}) {
  const { t } = useTranslation('coin-radar');

  if (!value || value.length === 0) return null;

  return (
    <ClickableTooltip
      chevron={false}
      className={clsx(
        'rounded-full text-center',
        size === 'xs' &&
          'flex h-4 items-center justify-center gap-px px-1 text-[9px] leading-none [&_img]:size-[12px] [&_svg]:size-[12px]',
        size === 'sm' &&
          'flex h-6 items-center justify-center px-1 text-xxs [&_img]:size-[14px] [&_svg]:size-[14px]',
        size === 'md' &&
          '[&_svg]:!size-[16px] h-6 px-2 text-xxs [&_img]:size-[16px]',
        'bg-v1-content-notice-bold/10 text-v1-content-notice',
        'overflow-hidden',
        className,
      )}
      disabled={!clickable}
      title={
        <div className="max-h-[300px] mobile:max-h-max min-w-48 space-y-2">
          <h4 className="border-b border-b-v1-content-primary/10 bg-v1-surface-l4 pb-2 font-medium text-base">
            {t('common.chains')}:
          </h4>
          {(value ?? []).map(network => (
            <div
              className="flex items-center justify-start gap-2"
              key={network.network.slug}
            >
              <img
                className="size-7 rounded-full bg-v1-surface-l2"
                src={network.network.icon_url}
              />
              <div className="grow">
                <p className="text-sm">{network.network.name}</p>
                <div className="flex w-full items-center justify-start gap-1 text-v1-content-secondary text-xxs">
                  {network.symbol_network_type === 'TOKEN' &&
                  !network.contract_address ? (
                    t('common:not-available')
                  ) : (
                    <ContractAddress allowCopy value={network} />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      }
    >
      <Icon name={bxNetworkChart} />
      {value.length > 0 && (
        <span className="flex items-center justify-center self-stretch text-v1-content-primary">
          {`${value.length}`}
        </span>
      )}
    </ClickableTooltip>
  );
}
