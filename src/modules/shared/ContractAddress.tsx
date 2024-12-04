import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { bxCopy } from 'boxicons-quasar';
import { type CoinNetwork } from 'api';
import { shortenAddress } from 'utils/shortenAddress';
import { ClickableTooltip } from './ClickableTooltip';
import { useShare } from './useShare';
import Icon from './Icon';

export function ContractAddress({
  className,
  value,
}: {
  value?: CoinNetwork | CoinNetwork[];
  className?: string;
}) {
  const { t } = useTranslation('common');
  const valueAsArray = useMemo(() => {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  }, [value]);
  const [copy, content] = useShare('copy');

  if (valueAsArray.length === 0) return null;

  return (
    <ClickableTooltip
      className={className}
      chevron
      title={
        <div className="min-w-48 space-y-3">
          {valueAsArray.map(network => (
            <div
              className="flex items-center gap-2"
              key={network.contract_address}
            >
              {network.network.icon_url ? (
                <img
                  className="size-6 shrink-0 overflow-hidden rounded-full bg-v1-surface-l3 object-contain"
                  src={network.network.icon_url}
                />
              ) : (
                <div className="size-6 shrink-0 rounded-full bg-v1-surface-l3 object-contain" />
              )}
              <div className="space-y-px">
                <p className="text-xs text-v1-content-primary">
                  {network.network.name}
                </p>
                <div className="flex items-center gap-1 text-xs text-v1-content-secondary">
                  {shortenAddress(network.contract_address)}
                  <Icon
                    name={bxCopy}
                    size={16}
                    className="cursor-pointer"
                    onClick={() => copy(network.contract_address)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      }
    >
      {valueAsArray.length > 1
        ? t('coin-radar:contract-address.multiple')
        : shortenAddress(valueAsArray[0].contract_address)}
      {content}
    </ClickableTooltip>
  );
}
