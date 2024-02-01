import { type FinancialProduct } from 'api/types/financialProduct';
import useIsFPRunning from '../useIsFPRunning';
import ButtonActivate from './ButtonActivate';
import ButtonDeactivate from './ButtonDeactivate';
import useModalActivationNotice from './useModalActivationNotice';

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
  const [ModalActivationNotice, showActivationNotice] =
    useModalActivationNotice();
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
          onSuccess={showActivationNotice}
        />
      )}
      {ModalActivationNotice}
    </>
  );
};

export default ButtonFPActivate;
