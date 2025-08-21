import { bxSearch } from 'boxicons-quasar';
import { clsx } from 'clsx';
import {
  type ComponentProps,
  type FC,
  useEffect,
  useRef,
  useState,
} from 'react';
import Icon from 'shared/Icon';
import { Input } from 'shared/v1-components/Input';
import { useOnClickOutside } from 'usehooks-ts';
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
          prefixIcon={<Icon name={bxSearch} />}
          type="string"
          {...props}
          size={size}
        />
      ) : (
        <Button
          fab
          onClick={() => setExpanded(true)}
          size={size}
          surface={surface}
          variant={props.value ? 'primary' : 'ghost'}
        >
          <Icon name={bxSearch} />
        </Button>
      )}
    </span>
  );
};
