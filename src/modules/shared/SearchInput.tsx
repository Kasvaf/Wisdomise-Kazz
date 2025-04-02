import { bxSearch } from 'boxicons-quasar';
import {
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type FC,
} from 'react';
import { useOnClickOutside } from 'usehooks-ts';
import { clsx } from 'clsx';
import Icon from 'shared/Icon';
import { Input } from 'shared/v1-components/Input';
import { Button } from './v1-components/Button';

export const SearchInput: FC<
  Omit<ComponentProps<typeof Input<'string'>>, 'type' | 'prefixIcon'>
> = ({ className, size, surface, ...props }) => {
  const el = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (expanded && el.current) {
      el.current.querySelector('input')?.focus?.();
    }
  }, [expanded]);

  useOnClickOutside(el, () => {
    setExpanded(false);
  });

  return (
    <span className={clsx('w-auto', className)} ref={el}>
      {expanded ? (
        <Input
          type="string"
          prefixIcon={<Icon name={bxSearch} />}
          {...props}
          size={size}
        />
      ) : (
        <Button
          variant="ghost"
          surface={surface}
          size={size}
          onClick={() => setExpanded(true)}
          fab
        >
          <Icon name={bxSearch} />
        </Button>
      )}
    </span>
  );
};
