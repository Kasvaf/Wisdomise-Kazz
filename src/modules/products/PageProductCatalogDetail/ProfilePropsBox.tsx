import { useTranslation } from 'react-i18next';
import { type FinancialProduct } from 'api/types/financialProduct';
import PriceChange from 'shared/PriceChange';

const ProfilePropsBox: React.FC<{ fp?: FinancialProduct }> = ({ fp }) => {
  const { t } = useTranslation('products');

  return (
    <div className="rounded-3xl bg-white/5 px-4 py-6 text-sm font-medium">
      <div className="mb-4 flex justify-between">
        <p className="text-white">{t('product-detail.expected-yield-apy')}</p>
        <PriceChange
          valueToFixed={false}
          value={Number(fp?.profile.expected_yield.replace('%', ''))}
        />
      </div>

      <div className="flex justify-between">
        <p className="text-white">
          {t('product-detail.expected-max-drawdown')}
        </p>
        <PriceChange
          bg={false}
          colorize={false}
          valueToFixed={false}
          value={Number(fp?.profile.max_drawdown.replace('%', ''))}
        />
      </div>
    </div>
  );
};

export default ProfilePropsBox;
