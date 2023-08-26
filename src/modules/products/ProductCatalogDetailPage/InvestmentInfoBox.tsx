import { type FinancialProduct } from 'api/types/financialProduct';
import useMainQuote from 'shared/useMainQuote';

const InvestmentInfoBox: React.FC<{ fp?: FinancialProduct }> = ({ fp }) => {
  const mainQuote = useMainQuote();

  return (
    <div className="rounded-3xl bg-white/5 px-4 py-6 text-sm">
      <p className="mb-4 text-white/80">Investment</p>
      <div className="flex items-center justify-between">
        <p className="w-full text-left text-white">
          <span className="text-white/40">Min</span>
          <br />
          <span className="font-medium">
            {fp?.min_deposit} <span className="text-white/80">{mainQuote}</span>
          </span>
        </p>
        <div className="h-[20px] w-[1px] rotate-12 border-l border-white/20" />
        <p className="w-full text-right text-white">
          <span className="text-white/40">Max</span>
          <br />
          <span className="font-medium">
            {fp?.max_deposit} <span className="text-white/80">{mainQuote}</span>
          </span>
        </p>
      </div>
    </div>
  );
};

export default InvestmentInfoBox;
