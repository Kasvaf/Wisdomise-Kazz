import { type FinancialProduct } from 'api/types/financialProduct';
import PriceChange from 'shared/PriceChange';

const ProfilePropsBox: React.FC<{ fp?: FinancialProduct }> = ({ fp }) => (
  <div className="rounded-3xl bg-white/5 px-4 py-6 text-sm font-medium">
    <div className="mb-4 flex justify-between">
      <p className="text-white">Expected Yield (APY)</p>
      <PriceChange
        valueToFixed={false}
        value={Number(fp?.profile.expected_yield.replace('%', ''))}
      />
    </div>

    <div className="flex justify-between">
      <p className="text-white">Expected Max Drawdown</p>
      <PriceChange
        bg={false}
        colorize={false}
        valueToFixed={false}
        value={Number(fp?.profile.max_drawdown.replace('%', ''))}
      />
    </div>
  </div>
);

export default ProfilePropsBox;
