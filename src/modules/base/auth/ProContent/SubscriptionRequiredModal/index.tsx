import { Modal } from 'antd';
import { clsx } from 'clsx';
import { Trans, useTranslation } from 'react-i18next';
import useIsMobile from 'utils/useIsMobile';
import { ProFeatures } from '../ProFeatures';
import Bg from './bg.png';

export function SubscriptionRequiredModal({
  open,
  onClose,
  onConfirm,
}: {
  open?: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
}) {
  const { t } = useTranslation('pro');
  const isMobile = useIsMobile();

  return (
    <Modal
      open={open}
      footer={false}
      centered
      className="[&_.ant-modal-content]:!p-0"
      width={880}
      onCancel={onClose}
      closable={!isMobile}
    >
      <div className="flex w-full items-stretch mobile:flex-col-reverse">
        <div className="flex grow flex-col bg-v1-surface-l1 p-9 mobile:p-4">
          <h2 className="mb-2 text-xl">
            <Trans ns="pro" i18nKey="renew-modal.title" />
          </h2>
          <p className="mb-6 text-xs leading-relaxed text-v1-content-primary/70 [&_b]:text-v1-content-primary">
            <Trans
              ns="pro"
              i18nKey="renew-modal.description"
              values={{
                days: '14',
              }}
            />
          </p>
          <ProFeatures className="mb-12" />
          <div className="flex flex-nowrap gap-4 mobile:flex-wrap">
            <button
              className={clsx(
                'flex h-12 w-full items-center justify-center gap-2 rounded-xl',
                'bg-pro-gradient text-black',
                'transition-all hover:brightness-110 active:brightness-95',
              )}
              onClick={onConfirm}
            >
              {t('renew-modal.renew')}
            </button>
          </div>
        </div>
        <div className="w-1/2 shrink-0 overflow-hidden mobile:h-64 mobile:w-auto mobile:p-4">
          <img
            src={Bg}
            className="mx-auto size-full bg-v1-surface-l3 object-contain object-center pe-12 mobile:rounded-xl mobile:p-4"
          />
        </div>
      </div>
    </Modal>
  );
}
