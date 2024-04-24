import { bxRightArrowAlt } from 'boxicons-quasar';
import Button from 'shared/Button';
import FpiActions from 'modules/investment/PageAssetOverview/ActiveFinancialProducts/FpiActions';
import { type FinancialProductInstance } from 'api/types/investorAssetStructure';
import Icon from 'shared/Icon';
import CongratsPng from './congrats.png';

const StepDone: React.FC<{
  financialProductInstance: FinancialProductInstance;
  onContinue: () => void;
}> = ({ financialProductInstance: fpi, onContinue }) => {
  return (
    <div className="-mt-9 text-center">
      <div className="-mb-6 flex justify-center text-5xl">
        <img className="h-[200px] w-[200px]" src={CongratsPng} />
      </div>
      <h1 className="mb-2 text-lg leading-4">Congratulations!</h1>
      <p className="mb-6 border-b border-white/50 pb-6 text-white/50">
        Your financial product has been created.{' '}
      </p>

      <div className="mb-1">There is one more step to complete.</div>
      <p className="text-xs text-white/50">
        Please go to your portfolio page
        <span className="mx-1 text-white">[Investment / Asset Overview]</span>
        and run your financial product.
      </p>

      <div className="my-8 flex justify-center">
        <FpiActions iconSize={32} fpi={fpi} />
      </div>

      <Button
        variant="primary"
        className="w-[360px] mobile:w-full"
        onClick={onContinue}
      >
        Start Your Financial Product
        <Icon className="ml-2" name={bxRightArrowAlt} />
      </Button>
    </div>
  );
};

export default StepDone;
