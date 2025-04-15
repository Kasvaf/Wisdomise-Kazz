import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { bxCopy } from 'boxicons-quasar';
import { type CoinNetwork } from 'api/types/shared';
import { ClickableTooltip } from 'shared/ClickableTooltip';
import { useShare } from 'shared/useShare';
import { shortenAddress } from 'utils/shortenAddress';
import Icon from 'shared/Icon';

export function CoinNetworksLabel({
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
  const [copy, content] = useShare('copy');

  if (!value || value.length === 0) return null;

  return (
    <>
      <ClickableTooltip
        title={
          <div className="min-w-48 space-y-2">
            <h4 className="sticky top-0 border-b border-b-v1-content-primary/10 bg-v1-surface-l4 pb-2 text-base font-medium">
              {t('common.chains')}:
            </h4>
            {(value ?? []).map(network => (
              <div
                key={network.network.slug}
                className="flex items-center justify-start gap-2"
              >
                <img
                  src={network.network.icon_url}
                  className="size-7 rounded-full bg-v1-surface-l2"
                />
                <div className="grow">
                  <p className="text-sm">{network.network.name}</p>
                  <div className="flex w-full items-center justify-start gap-1 text-xxs text-v1-content-secondary">
                    {network.symbol_network_type === 'COIN' &&
                      t('common.native_coin')}
                    {network.symbol_network_type === 'TOKEN' && (
                      <>
                        {network.contract_address ? (
                          <>
                            {shortenAddress(network.contract_address)}
                            <Icon
                              name={bxCopy}
                              size={14}
                              className="cursor-pointer"
                              onClick={() => copy(network.contract_address)}
                            />
                          </>
                        ) : (
                          <>{t('common:not-available')}</>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        }
        className={clsx(
          'rounded-full text-center text-xxs',
          size === 'xs' &&
            'flex h-4 items-center justify-center [&_img]:size-[10px] [&_svg]:size-[10px]',
          size === 'sm' &&
            'flex h-6 items-center justify-center [&_img]:size-[14px] [&_svg]:size-[14px]',
          size === 'md' && 'h-6 [&_img]:size-[16px] [&_svg]:!size-[16px]',
          'bg-v1-content-notice-bold/10 text-v1-content-notice',
          'overflow-hidden',
          className,
        )}
        chevron={false}
        disabled={!clickable}
      >
        <span className={clsx(size === 'xs' ? 'px-1' : 'px-2')}>
          {size === 'md' ? t('common.chain') : 'Ch'}
        </span>
        {value.length > 0 && (
          <span className="-ms-1 flex items-center justify-center self-stretch bg-white/5 pe-2 ps-1 text-v1-content-primary">
            {`+${value.length}`}
          </span>
        )}
      </ClickableTooltip>
      {content}
    </>
  );
}
