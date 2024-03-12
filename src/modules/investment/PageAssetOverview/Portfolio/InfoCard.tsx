import { clsx } from 'clsx';
import * as numerable from 'numerable';
import Card from 'shared/Card';
import useMainQuote from 'shared/useMainQuote';

const InfoCard: React.FC<{
  title: string;
  value: number;
  icon: React.FC;
  format?: string;
  subtitle?: string;
  className?: string;
  valueClassName?: string;
  colorizeValue?: boolean;
}> = ({
  title,
  value,
  format = '0,0.00',
  subtitle,
  icon: Icon,
  colorizeValue = false,
  className,
  valueClassName,
}) => {
  const mainQuote = useMainQuote();

  return (
    <Card
      className={clsx(
        'flex !p-6 mobile:border-t mobile:border-white/5',
        className,
      )}
    >
      <div className="flex grow flex-col justify-between">
        <p className="text-sm leading-none text-white/60">
          {title} <span className="text-xxs text-white/40">{subtitle}</span>
        </p>

        <p
          className={clsx(
            'mt-4 text-xl font-semibold leading-none text-white',
            colorizeValue && value >= 0 && '!text-[#40F19C]',
            valueClassName,
          )}
        >
          {numerable.format(value, format, {
            rounding: 'floor',
          })}
          <span className="ml-1 text-xs text-white/40">{mainQuote}</span>
        </p>
      </div>
      <div className="mb-2 flex justify-end mobile:mb-0">
        <Icon />
      </div>
    </Card>
  );
};

export default InfoCard;
