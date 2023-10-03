import { clsx } from 'clsx';
import { type ReactNode } from 'react';

interface ChipProps {
  label: string;
  disabled?: boolean;
  className?: string;
  selected?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  onClick?: (event: React.MouseEvent) => void;
}

export default function Chip({
  label,
  disabled,
  className,
  selected,
  leadingIcon,
  trailingIcon,
  onClick,
}: ChipProps) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'm-2 inline-block h-9 select-none rounded-3xl border-[1px] border-white/40 p-2 pr-3 transition-colors',
        selected && '!border-transparent bg-white/20 font-bold',
        !disabled && 'cursor-pointer',
        className,
      )}
    >
      <div className="flex h-full items-center gap-2">
        {leadingIcon}
        <span className="text-xs">{label}</span>
        {trailingIcon}
      </div>
    </div>
  );
}
