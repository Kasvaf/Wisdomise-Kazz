import { useTranslation } from 'react-i18next';
import { type FinancialProduct } from 'api/types/financialProduct';
import useMainQuote from 'shared/useMainQuote';
import Card from 'shared/Card';

const InvestmentInfoBox: React.FC<{ fp?: FinancialProduct }> = ({ fp }) => {
  const { t } = useTranslation('products');
  const mainQuote = useMainQuote();

  return (
    <Card className="!px-4 !py-6 text-sm">
      <p className="mb-4 text-white/80">{t('product-detail.investment')}</p>
      <div className="flex items-center justify-between">
        <p className="w-full text-left text-white">
          <span className="text-white/40">{t('product-detail.min')}</span>
          <br />
          <span className="font-medium">
            {fp?.min_deposit} <span className="text-white/80">{mainQuote}</span>
          </span>
        </p>
        <div className="h-[20px] w-[1px] rotate-12 border-l border-white/20" />
        <p className="w-full text-right text-white">
          <span className="text-white/40">{t('product-detail.max')}</span>
          <br />
          <span className="font-medium">
            {fp?.max_deposit} <span className="text-white/80">{mainQuote}</span>
          </span>
        </p>
      </div>
    </Card>
  );
};

export default InvestmentInfoBox;
