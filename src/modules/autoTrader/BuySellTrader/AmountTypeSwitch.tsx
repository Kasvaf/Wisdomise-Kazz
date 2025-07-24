import { bxTransfer } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { Coin } from 'shared/Coin';
import { Button } from 'shared/v1-components/Button';
import { useSymbolInfo } from 'api/symbol';
import Icon from 'shared/Icon';
import { type Surface } from 'utils/useSurface';

export default function AmountTypeSwitch({
  base,
  quote,
  value,
  onChange,
  showIcon,
  surface,
}: {
  base?: string;
  quote?: string;
  value: 'percentage' | 'base' | 'quote';
  onChange: (value: 'percentage' | 'base' | 'quote') => void;
  showIcon?: boolean;
  surface?: Surface;
}) {
  const { data: baseInfo } = useSymbolInfo(base);
  const { data: quoteInfo } = useSymbolInfo(quote);

  const symbol = value === 'quote' ? quoteInfo : baseInfo;

  return (
    <Button
      variant="ghost"
      size="2xs"
      className={clsx('shrink-0', showIcon && '!px-1')}
      surface={surface ?? 2}
      fab={!showIcon}
      onClick={() => {
        onChange(
          value === 'percentage'
            ? base
              ? 'base'
              : 'quote'
            : value === 'base'
            ? 'quote'
            : 'percentage',
        );
      }}
    >
      {value === 'percentage'
        ? '%'
        : symbol && (
            <Coin className="-mr-2" coin={symbol} mini noText nonLink />
          )}
      {showIcon && (
        <div>
          <Icon name={bxTransfer} className="!text-white/40 [&>svg]:!size-4" />
        </div>
      )}
    </Button>
  );
}
