import { type FinancialProduct } from 'api/types/financialProduct';
import useIsFPRunning from '../useIsFPRunning';
import ButtonActivate from './ButtonActivate';
import ButtonDeactivate from './ButtonDeactivate';
import useModalFpActivation from './useModalFpActivation';

interface Props {
  inDetailPage?: boolean;
  className?: string;
  financialProduct?: FinancialProduct;
}

const ButtonFPActivate: React.FC<Props> = ({
  className,
  inDetailPage,
  financialProduct: fp,
}) => {
  const isRunning = useIsFPRunning(fp?.key);
  const [ModalFpActivation, showModalFpActivation] = useModalFpActivation();
  if (!fp) return null;

  return (
    <>
      {isRunning ? (
        <ButtonDeactivate
          financialProduct={fp}
          inDetailPage={inDetailPage}
          className={className}
        />
      ) : (
        <ButtonActivate
          financialProduct={fp}
          className={className}
          onCreate={() => showModalFpActivation({ financialProduct: fp })}
        />
      )}
      {ModalFpActivation}
    </>
  );
};

export default ButtonFPActivate;
