import { bxTransfer } from 'boxicons-quasar';
import { clsx } from 'clsx';
import Icon from 'shared/Icon';
import { Button } from 'shared/v1-components/Button';
import { Token } from 'shared/v1-components/Token';
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
  value: 'percentage' | 'quote';
  onChange: (value: 'percentage' | 'quote') => void;
  showIcon?: boolean;
  surface?: Surface;
}) {
  const symbol = value === 'quote' ? quote : base;

  return (
    <Button
      className={clsx('shrink-0', showIcon && '!px-1')}
      fab={!showIcon}
      onClick={() => {
        onChange(value === 'percentage' ? 'quote' : 'percentage');
      }}
      size="2xs"
      surface={surface}
      variant="ghost"
    >
      {value === 'percentage' ? (
        <span className={showIcon ? 'w-4' : ''}>%</span>
      ) : (
        symbol && <Token autoFill icon link={false} size="xs" slug={symbol} />
      )}
      {showIcon && (
        <div>
          <Icon className="!text-white/40 [&>svg]:!size-4" name={bxTransfer} />
        </div>
      )}
    </Button>
  );
}
