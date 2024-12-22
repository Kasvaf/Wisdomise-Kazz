import { clsx } from 'clsx';
import { useMemo, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { bxCopy } from 'boxicons-quasar';
import { type CoinNetwork, type Coin } from 'api/types/shared';
import { ClickableTooltip } from 'shared/ClickableTooltip';
import { useShare } from 'shared/useShare';
import { shortenAddress } from 'utils/shortenAddress';
import Icon from 'shared/Icon';

const sharedLabelClassName = clsx(
  'rounded-full px-3 py-1 text-center text-xxs',
);

function CoinLabel({
  className,
  value,
}: {
  className?: string;
  value: string;
}) {
  const { t } = useTranslation('coin-radar');

  const renderData = useMemo(() => {
    const knownSuffixes = {
      hype: '🔥',
      weekly_social_beloved: '🌐',
      monthly_social_beloved: '🌐',
    };
    const knownInfos = {
      hype: t('coin_labels.hype.info'),
      weekly_social_beloved: t('coin_labels.weekly_social_beloved.info'),
      monthly_social_beloved: t('coin_labels.monthly_social_beloved.info'),
    };
    const knowColors = {
      hype: clsx('bg-v1-content-positive/10 text-v1-content-positive'),
      weekly_social_beloved: clsx(
        'bg-v1-content-brand/10 text-v1-content-brand',
      ),
      monthly_social_beloved: clsx(
        'bg-v1-content-brand/10 text-v1-content-brand',
      ),
    };
    const defaultColor = clsx(
      'bg-v1-content-tertiary/10 text-v1-content-tertiary',
    );

    return {
      emoji: value in knownSuffixes ? knownSuffixes[value as never] : '🏷️',
      text: value.split('_').join(' '),
      info: value in knownInfos ? knownInfos[value as never] : undefined,
      className:
        value in knowColors ? knowColors[value as never] : defaultColor,
    };
  }, [value, t]);

  return (
    <ClickableTooltip
      title={
        <div>
          <p className="mb-2 text-sm capitalize text-v1-content-primary">
            {renderData.text}
          </p>
          <p className="text-xs text-v1-content-secondary">{renderData.info}</p>
        </div>
      }
      chevron={false}
      disabled={!renderData.info}
      className={clsx(
        sharedLabelClassName,
        renderData.className,
        'whitespace-nowrap capitalize',
        className,
      )}
    >
      {renderData.emoji} {renderData.text}
    </ClickableTooltip>
  );
}

export function CoinLabels({
  className,
  categories,
  networks,
  labels,
  prefix,
  suffix,
}: {
  className?: string;
  categories?: Coin['categories'] | null;
  networks?: CoinNetwork[] | null;
  maxCategories?: number;
  labels?: string[] | null;
  prefix?: ReactNode;
  suffix?: ReactNode;
}) {
  const { t } = useTranslation('coin-radar');
  const [copy, content] = useShare('copy');
  return (
    <div
      className={clsx(
        'flex flex-wrap items-start justify-start gap-[2px]',
        className,
      )}
    >
      {prefix}
      {categories && categories.length > 0 && (
        <ClickableTooltip
          title={
            <div className="min-w-48 space-y-2">
              <h4 className="sticky top-0 border-b border-b-v1-content-primary/10 bg-v1-surface-l4 pb-2 text-base font-medium">
                {t('common.categories')}:
              </h4>
              {(categories ?? []).map(cat => (
                <div key={cat.slug} className="text-sm">
                  {cat.name}
                </div>
              ))}
            </div>
          }
          className={clsx(
            sharedLabelClassName,
            'bg-v1-content-primary/10 text-v1-content-primary',
            'overflow-hidden !p-0',
          )}
          chevron={false}
        >
          <span className="px-3 py-1">{categories[0].name}</span>
          {categories.length > 1 && (
            <span className="-ms-2 flex items-center justify-center self-stretch bg-v1-content-primary/10 pe-2 ps-1">
              {`+${categories.length - 1}`}
            </span>
          )}
        </ClickableTooltip>
      )}
      {networks && networks.length > 0 && (
        <ClickableTooltip
          title={
            <div className="min-w-48 space-y-2">
              <h4 className="sticky top-0 border-b border-b-v1-content-primary/10 bg-v1-surface-l4 pb-2 text-base font-medium">
                {t('common.networks')}:
              </h4>
              {(networks ?? []).map(network => (
                <div
                  key={network.network.id}
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
            sharedLabelClassName,
            'bg-v1-background-brand/15 text-v1-content-primary',
            'overflow-hidden !p-0',
          )}
          chevron={false}
        >
          <span className="px-3 py-1">{networks[0].network.name}</span>
          {networks.length > 1 && (
            <span className="-ms-2 flex items-center justify-center self-stretch bg-v1-content-primary/10 pe-2 ps-1">
              {`+${networks.length - 1}`}
            </span>
          )}
        </ClickableTooltip>
      )}
      {(labels ?? []).map(label => (
        <CoinLabel key={label} value={label} />
      ))}
      {suffix}
      {content}
    </div>
  );
}
