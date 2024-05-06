import { type FinancialProduct } from 'api/types/financialProduct';
import { useHasFlag } from 'api';
import useIsFPRunning from '../useIsFPRunning';
import ButtonActivate from './ButtonActivate';
import ButtonDeactivate from './ButtonDeactivate';
import useModalFpActivation from './useModalFpActivation';
import useModalFpWaitList from './useModalFpWaitList';

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
  const hasFlag = useHasFlag();
  const isRunning = useIsFPRunning(fp?.key);
  const [ModalFpWaitList, showModalFpWaitList] = useModalFpWaitList();
  const [ModalFpActivation, showModalFpActivation] = useModalFpActivation();
  if (!fp) return null;

  const activateHandler = async () => {
    await (hasFlag('?activate-no-wait')
      ? showModalFpActivation({ financialProduct: fp })
      : showModalFpWaitList());
  };

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
          onCreate={activateHandler}
        />
      )}
      {ModalFpWaitList}
      {ModalFpActivation}
    </>
  );
};

export default ButtonFPActivate;
