import * as numerable from 'numerable';
import { useTranslation } from 'react-i18next';

const MinMaxInfo: React.FC<{
  min: number;
  max: number;
}> = ({ min, max }) => {
  const { t } = useTranslation('products');
  return (
    <section className="my-3 flex items-center justify-between border-y border-white/10 py-3">
      <div className="flex items-center mobile:flex-col mobile:items-start">
        <span className="text-white/40 mobile:text-xxs">
          {t('fp-activation.min-investment')}
        </span>
        <span className="ml-3 mobile:ml-0">
          <span>{numerable.format(min, '0,0')}</span>
          <span className="ml-1 text-xs text-white/40">USDT</span>
        </span>
      </div>
      <div className="flex items-center mobile:flex-col mobile:items-end">
        <span className="text-white/40 mobile:text-xxs">
          {t('fp-activation.max-investment')}
        </span>
        <span className="ml-3 mobile:ml-0">
          <span>{numerable.format(max, '0,0')}</span>
          <span className="ml-1 text-xs text-white/40">USDT</span>
        </span>
      </div>
    </section>
  );
};

export default MinMaxInfo;
