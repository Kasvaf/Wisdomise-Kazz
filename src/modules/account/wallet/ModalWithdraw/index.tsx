import { useTranslation } from 'react-i18next';
import { useHasFlag } from 'api';
import { SUPPORT_EMAIL } from 'config/constants';
import ModalWithdraw from './ModalWithdraw';

const ModalWithdrawProxy: React.FC<{ onResolve?: () => void }> = ({
  onResolve,
}) => {
  const { t } = useTranslation('wallet');
  const hasFlag = useHasFlag();

  if (hasFlag('/withdraw')) {
    return <ModalWithdraw onResolve={onResolve} />;
  }

  return (
    <div className="text-white">
      <h1 className="mb-6 text-center text-xl">{t('modal-withdraw.title')}</h1>
      <div className="text-center">
        To withdraw your money, please contact our{' '}
        <a href={`mailto:${SUPPORT_EMAIL}`} className="text-info">
          support
        </a>
        .
      </div>
    </div>
  );
};

export default ModalWithdrawProxy;
