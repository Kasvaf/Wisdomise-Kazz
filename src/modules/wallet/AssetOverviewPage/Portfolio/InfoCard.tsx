import { clsx } from 'clsx';
import * as numerable from 'numerable';
import useMainQuote from '../useMainQuote';

const InfoCard: React.FC<{
  title: string;
  value: number;
  icon: React.FC;
  format?: string;
  subtitle?: string;
  className?: string;
  diffMobileView?: boolean;
  colorizeValue?: boolean;
}> = ({
  title,
  value,
  format = '0,0.00',
  subtitle,
  icon: Icon,
  colorizeValue = false,
  className,
  diffMobileView,
}) => {
  const mainQuote = useMainQuote();

  return (
    <div
      className={clsx(
        'rounded-3xl bg-white/5 p-6',
        className,
        diffMobileView &&
          'mobile:flex mobile:flex-row-reverse mobile:border-t mobile:border-white/5',
      )}
    >
      <div className="mb-2 flex justify-end mobile:mb-0">
        <Icon />
      </div>
      <div className={clsx(diffMobileView && 'mobile:grow')}>
        <p className="text-sm leading-none text-white/60">
          {title} <span className="text-xxs text-white/40">{subtitle}</span>
        </p>

        <p
          className={clsx(
            'mt-4 text-xl font-semibold leading-none text-white',
            colorizeValue && value >= 0 && '!text-[#40F19C]',
            title === 'Balance' && '!text-2xl',
          )}
        >
          {numerable.format(value, format, {
            rounding: 'floor',
          })}
          <span className="ml-1 text-xs text-white/40">{mainQuote}</span>
        </p>
      </div>
    </div>
  );
};

export default InfoCard;
