import Button from 'shared/Button';
import Card from 'shared/Card';
import useModal from 'shared/useModal';
import PricingTable from 'modules/account/PageBilling/PricingTable';
import { ReactComponent as SubscriptionIcon } from './icons/subscription.svg';

export default function Utility() {
  const [PricingTableMod, openPricingTable] = useModal(PricingTable, {
    width: 1200,
  });

  const goToBilling = () => {
    void openPricingTable({ isTokenUtility: true });
  };

  return (
    <Card className="relative flex flex-col gap-3">
      <SubscriptionIcon className="absolute right-0 top-0" />
      <h2 className="mb-2 text-2xl font-medium">Utility Activation</h2>
      <div className="flex flex-col items-center text-center">
        <strong className="mb-2 font-medium">Activate Subscription</strong>
        <p className="mb-2 text-white/40">
          Lock your $WSDM tokens to gain access to our products.
        </p>
        <Button variant="alternative" onClick={goToBilling}>
          Lock WSDM
        </Button>
      </div>
      {PricingTableMod}
    </Card>
  );
}
