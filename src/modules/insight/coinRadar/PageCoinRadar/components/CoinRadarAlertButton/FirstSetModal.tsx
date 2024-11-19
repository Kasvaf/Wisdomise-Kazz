import { Modal } from 'antd';
import { Trans, useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { useAccountQuery } from 'api';
import { ReactComponent as ModalIcon } from './modal-icon.svg';
import { ReactComponent as GearIcon } from './gear.svg';
import { ReactComponent as Screener2Icon } from './screener2.svg';

export function FirstSetModal({
  open,
  onExpand,
  onClose,
}: {
  open?: boolean;
  onExpand?: () => void;
  onClose?: () => void;
}) {
  const { t } = useTranslation('coin-radar');
  const me = useAccountQuery();
  return (
    <Modal
      open={open}
      centered
      onCancel={onClose}
      className="max-w-[424px] mobile:max-w-[360px] [&_.ant-modal-content]:!bg-v1-surface-l1"
      destroyOnClose
      footer={false}
    >
      <div className="flex flex-col items-center gap-7 pt-7">
        <div className="relative flex size-28 items-center justify-center">
          <ModalIcon className="absolute inset-0 size-full" />
          <Screener2Icon />
        </div>
        <h2 className="max-w-64 text-center text-xl text-v1-content-primary">
          {t('screener.activated.title')}
        </h2>
        <div className="text-center">
          <p className="text-xs text-v1-content-secondary [&_b]:font-normal [&_b]:text-v1-content-link">
            <Trans
              ns="coin-radar"
              i18nKey="screener.activated.summary"
              values={{
                email: me.data?.email,
              }}
            />
          </p>
          <p className="mt-1 text-xs text-v1-content-primary">
            {t('screener.activated.subtitle')}
          </p>
        </div>
        <div className="w-full space-y-3 rounded-xl bg-v1-surface-l2 p-4 text-v1-content-primary">
          <div className="flex items-center justify-between text-xs">
            {t('screener.activated.preview.title')}
            <button onClick={onExpand} className="shrink-0">
              <GearIcon className="size-5" />
            </button>
          </div>
          <div className="h-px bg-white/10" />
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <p className="text-v1-content-secondary">
                {t('screener.activated.preview.type.label')}
              </p>
              <p>{t('screener.activated.preview.type.value')}</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-v1-content-secondary">
                {t('screener.activated.preview.category.label')}
              </p>
              <p>{t('screener.activated.preview.category.value')}</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-v1-content-secondary">
                {t('screener.activated.preview.chain.label')}
              </p>
              <p>{t('screener.activated.preview.chain.value')}</p>
            </div>
          </div>
        </div>
        <div className="mt-2 flex w-full gap-2">
          <button
            className={clsx(
              'flex h-12 w-full items-center justify-center gap-2 rounded-xl border px-6 text-sm text-v1-content-primary',
              'transition-all enabled:hover:brightness-110 enabled:active:brightness-90',
              'border-v1-border-brand bg-v1-content-brand',
            )}
            onClick={onClose}
          >
            {t('screener.activated.got-it')}
          </button>
        </div>
      </div>
    </Modal>
  );
}
