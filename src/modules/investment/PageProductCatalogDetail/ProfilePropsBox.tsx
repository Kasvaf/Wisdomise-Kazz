import { type FinancialProduct } from 'api/types/financialProduct';
import Card from 'shared/Card';
import ProductInfoLines from '../ProductInfoLines';
import ProductSubscriptionNotice from './ProductSubscriptionNotice';

const ProfilePropsBox: React.FC<{ fp?: FinancialProduct }> = ({ fp }) => {
  return (
    <Card className="!px-4 !py-6 text-sm font-medium">
      <ProductInfoLines fp={fp} />
      {fp && <ProductSubscriptionNotice className="mt-4" fp={fp} />}
    </Card>
  );
};

export default ProfilePropsBox;
