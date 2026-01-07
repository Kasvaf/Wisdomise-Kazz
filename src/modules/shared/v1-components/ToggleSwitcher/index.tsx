import clsx from 'clsx';
import './style.css';

interface ToggleSwitcherProps {
  value: 'buy' | 'sell';
  onChange: (value: 'buy' | 'sell') => void;
  className?: string;
}

export function ToggleSwitcher({
  value,
  onChange,
  className = '',
}: ToggleSwitcherProps) {
  return (
    <div className={clsx('toggle-switcher', className)}>
      <button
        className={clsx('toggle-switcher__option', {
          'toggle-switcher__option--active': value === 'buy',
        })}
        onClick={() => onChange('buy')}
        type="button"
      >
        Buy
      </button>
      <button
        className={clsx('toggle-switcher__option', {
          'toggle-switcher__option--active': value === 'sell',
        })}
        onClick={() => onChange('sell')}
        type="button"
      >
        Sell
      </button>
      <div
        className={clsx('toggle-switcher__indicator', {
          'toggle-switcher__indicator--sell': value === 'sell',
        })}
      />
    </div>
  );
}
