import { useSymbolInfo } from 'api/symbol';
import { bxTransfer } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { Coin } from 'shared/Coin';
import Icon from 'shared/Icon';
import { Button } from 'shared/v1-components/Button';
import type { Surface } from 'utils/useSurface';

export default function AmountTypeSwitch({
  base,
  quote,
  value,
  onChange,
  showIcon,
  surface = 1,
}: {
  base?: string;
  quote?: string;
  value: 'percentage' | 'base' | 'quote';
  onChange: (value: 'percentage' | 'base' | 'quote') => void;
  showIcon?: boolean;
  surface?: Surface;
}) {
  const { data: baseInfo } = useSymbolInfo({ slug: base });
  const { data: quoteInfo } = useSymbolInfo({ slug: quote });

  const symbol = value === 'quote' ? quoteInfo : baseInfo;

  return (
    <Button
      className={clsx('shrink-0', showIcon && '!px-1')}
      fab={!showIcon}
      onClick={() => {
        onChange(
          value === 'percentage'
            ? 'quote'
            : value === 'quote'
              ? base
                ? 'base'
                : 'percentage'
              : 'percentage',
        );
      }}
      size="2xs"
      surface={surface}
      variant="ghost"
    >
      {value === 'percentage' ? (
        <span className={showIcon ? 'w-4' : ''}>%</span>
      ) : (
        symbol && <Coin className="-mr-2" coin={symbol} mini nonLink noText />
      )}
      {showIcon && (
        <div>
          <Icon className="!text-white/40 [&>svg]:!size-4" name={bxTransfer} />
        </div>
      )}
    </Button>
  );
}
