import { clsx } from 'clsx';
import type React from 'react';
import { type PropsWithChildren, useCallback } from 'react';

interface Props {
  options: string[];
  onClick: (val: any) => void;
}

const OptionItem: React.FC<
  PropsWithChildren<{
    className?: string;
    item: string;
    onClick: (item: string) => void;
  }>
> = ({ children, className, item, onClick }) => {
  return (
    <div
      className={clsx(
        'grow cursor-pointer py-2 text-center hover:bg-white/10',
        className,
      )}
      onClick={useCallback(() => onClick(item), [onClick, item])}
    >
      {children}
    </div>
  );
};

const MultiButton: React.FC<Props> = ({ options, onClick }) => {
  const itemClickHandler = useCallback(
    (val: string) => onClick(val),
    [onClick],
  );

  return (
    <div className="flex overflow-hidden rounded-xl bg-white/5">
      {options.map((opt, ind) => (
        <div className="flex flex-1" key={opt}>
          <OptionItem item={opt} onClick={itemClickHandler}>
            {opt}
          </OptionItem>
          {ind !== options.length - 1 && (
            <div className="my-2 border-l border-white/10" />
          )}
        </div>
      ))}
    </div>
  );
};

export default MultiButton;
