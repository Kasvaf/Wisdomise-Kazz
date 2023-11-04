import { Popover } from 'antd';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { type FpiStatusMutationType } from 'api';
import Button from 'shared/Button';

interface Props {
  type: FpiStatusMutationType;
  children: React.ReactNode;
  onConfirm: () => Promise<unknown>;
  disabled?: boolean;
}

const PopConfirmChangeFPIStatus: React.FC<Props> = ({
  type,
  children,
  onConfirm,
  disabled,
}) => {
  const { t } = useTranslation('fpi');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [overrideType, setOverrideType] = useState<FpiStatusMutationType>();

  const onConfirmClick = async () => {
    try {
      setOverrideType(type);
      setLoading(true);
      await onConfirm();
      setLoading(false);
      setIsOpen(false);
      setOverrideType(undefined);
    } catch {
      //
    }
  };
  const visibleType = overrideType || type;
  const typeLabel = {
    stop: t('actions.stop'),
    start: t('actions.start'),
    pause: t('actions.pause'),
    resume: t('actions.resume'),
  }[visibleType];

  return (
    <Popover
      open={isOpen}
      content={
        <section className="mx-2 max-w-[400px] text-white/80">
          <p className="mb-2 text-lg">
            <Trans i18nKey="action-confirm.title" ns="fpi">
              Are You Sure To
              <span className="text-base font-medium text-white">
                {{ typeLabel }}
              </span>
              This Product?
            </Trans>
          </p>
          {visibleType === 'stop' && (
            <div>{t('action-confirm.stop-description')}</div>
          )}

          <section className="mt-6 flex justify-center">
            <Button
              variant="secondary"
              size="small"
              onClick={() => setIsOpen(false)}
            >
              {t('action-confirm.cancel')}
            </Button>
            <div className="w-4" />
            <Button size="small" onClick={onConfirmClick} loading={loading}>
              <Trans i18nKey="action-confirm.yes" ns="fpi">
                Yes,
                <span className="ml-1">{{ typeLabel }}</span>
              </Trans>
            </Button>
          </section>
        </section>
      }
    >
      <section onClick={() => !disabled && setIsOpen(true)}>{children}</section>
    </Popover>
  );
};

export default PopConfirmChangeFPIStatus;
