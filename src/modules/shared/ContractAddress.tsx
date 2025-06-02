import { useMemo, type FC } from 'react';
import { bxsCopy } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { shortenAddress } from 'utils/shortenAddress';
import { type CoinNetwork } from 'api/discovery';
import Icon from './Icon';
import { useShare } from './useShare';

export const ContractAddress: FC<{
  className?: string;
  value?: CoinNetwork[] | CoinNetwork | string;
  allowCopy?: boolean;
}> = ({ className, value, allowCopy = true }) => {
  const { t } = useTranslation('coin-radar');
  const [copy, copyNotif] = useShare('copy');

  const data = useMemo<{
    title: string;
    value: string | undefined;
  }>(() => {
    const empty = {
      title: t('common:not-available'),
      value: undefined,
    };
    const multiple = {
      title: t('common.multiple_chain'),
      value: undefined,
    };
    const native = {
      title: t('common.native_coin'),
      value: undefined,
    };

    if (value === undefined) return empty;

    let arr: Array<{
      type: 'TOKEN' | 'COIN';
      value: string;
      network?: string;
    }> = [];

    if (typeof value === 'string') {
      arr = value
        ? [
            ...arr,
            {
              type: 'TOKEN',
              value,
              network: undefined,
            },
          ]
        : [
            ...arr,
            {
              type: 'COIN',
              value: '',
              network: undefined,
            },
          ];
    } else if (Array.isArray(value)) {
      arr = [
        ...arr,
        ...value.map(x => ({
          type: x.symbol_network_type,
          value: x.contract_address,
          network: x.network.slug,
        })),
      ];
    } else {
      arr = [
        ...arr,
        {
          type: value.symbol_network_type,
          value: value.contract_address,
          network: value.network.slug,
        },
      ];
    }

    if (arr.length === 0) return empty;

    if (arr.length > 1) return multiple;

    if (arr[0].type === 'COIN') return native;

    return {
      value: arr[0].value,
      title: shortenAddress(arr[0].value),
    };
  }, [value, t]);

  return (
    <>
      {data.value === undefined ? (
        <p className={className}>{data.title}</p>
      ) : (
        <div className={clsx('flex items-center gap-1', className)}>
          {data.title}
          {allowCopy && (
            <button
              onClick={() => copy(data.value ?? '')}
              className="cursor-copy"
            >
              <Icon name={bxsCopy} size={12} />
            </button>
          )}
          {allowCopy && copyNotif}
        </div>
      )}
    </>
  );
};
