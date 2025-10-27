import { clsx } from 'clsx';
import { HoverTooltip } from 'shared/HoverTooltip';
import { Token } from 'shared/v1-components/Token';

export function Tokens({
  className,
  addresses,
}: {
  addresses?: string[];
  className?: string;
}) {
  return (
    <HoverTooltip
      title={
        <div className="flex flex-col gap-2">
          {addresses?.map(address => (
            <Token address={address} autoFill key={address} size="md" />
          ))}
        </div>
      }
    >
      <span
        className={clsx(
          '-space-x-1 inline-flex w-auto shrink cursor-help items-center justify-start',
          className,
        )}
      >
        {addresses?.slice(0, 3).map(address => (
          <Token address={address} autoFill icon key={address} size="xs" />
        ))}
        {(addresses?.length ?? 0) > 3 && (
          <div
            className={clsx(
              'inline-flex items-center justify-center overflow-hidden rounded-full border border-v1-surface-l3 bg-v1-surface-l4 text-[8px] text-v1-content-primary',
            )}
          >
            +{(addresses?.length ?? 0) - 3}
          </div>
        )}
      </span>
    </HoverTooltip>
  );
}
