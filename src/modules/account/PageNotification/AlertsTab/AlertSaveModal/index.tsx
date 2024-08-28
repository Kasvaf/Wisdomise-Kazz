/* eslint-disable import/max-dependencies */
import { clsx } from 'clsx';
import { Controller, useForm } from 'react-hook-form';
import {
  bxBell,
  bxChevronLeft,
  bxInfoCircle,
  bxRightArrowAlt,
  bxX,
} from 'boxicons-quasar';
import { useEffect, type FC, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { Tooltip } from 'antd';
import Button from 'shared/Button';
import { type Alert } from 'api/alert';
import { Toggle } from 'shared/Toggle';
import Icon from 'shared/Icon';
import { DrawerModal } from 'shared/DrawerModal';
import { AlertFormStep, useAlertFormStep } from './AlertFormStep';
import { PairBaseSelect } from './PairBaseSelect';
import { OperatorSelect } from './OperatorSelect';
import { PairQuoteSelect } from './PairQuoteSelect';
import { ExchangeSelect } from './ExchangeSelect';
import { IntervalSelect } from './IntervalSelect';
import { AlertChannelsSelect } from './AlertChannelsSelect';
import { PriceInput } from './PriceInput';
import { CoinPriceInfo } from './CoinPriceInfo';
import { AlertSubscriptionBanner } from './AlertSubscriptionBanner';

const FormControlWithLabel: FC<{
  type?: 'normal' | 'box' | 'inline';
  children?: ReactNode;
  label?: string;
  className?: string;
  info?: ReactNode;
}> = ({ children, label, type = 'normal', className, info }) => {
  const infoContent = info && (
    <Tooltip title={info}>
      <Icon
        name={bxInfoCircle}
        size={16}
        className="ms-1 inline-block align-middle"
      />
    </Tooltip>
  );
  return (
    <>
      {type === 'normal' ? (
        <div className={clsx('space-y-2', className)}>
          <label className="block px-2 text-xs text-white/95">
            {label}
            {infoContent}
          </label>
          <div>{children}</div>
        </div>
      ) : type === 'box' ? (
        <div
          className={clsx(
            'mx-auto inline-flex items-center justify-center gap-4',
            'rounded-xl bg-black/20 px-8 py-6 text-xs text-white/60',
            className,
          )}
        >
          {label}
          {infoContent}
          {children}
        </div>
      ) : (
        <div
          className={clsx(
            'inline-flex items-center justify-center gap-4',
            className,
          )}
        >
          {label && (
            <p className="whitespace-nowrap">
              {label}
              {infoContent}
            </p>
          )}
          {children}
        </div>
      )}
    </>
  );
};

export function AlertSaveModal({
  alert: alertItem,
  isOpen,
  onClose,
  onSubmit,
  assetLock,
  showLink,
  loading,
}: {
  alert?: Partial<Alert<'market_data'>>;
  onSubmit?: (newAlert: Alert<'market_data'>) => void;
  assetLock?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  showLink?: boolean;
  loading?: boolean;
}) {
  if (alertItem?.dataSource && alertItem.dataSource !== 'market_data')
    throw new Error('Alert schema not supported!');
  const { t } = useTranslation('notifications');

  const alertForm = useForm<Alert<'market_data'>>({
    resolver: values => {
      return {
        values,
        errors: {
          ...(!values.messengers ||
            (values.messengers.length === 0 && {
              messangers: true,
            })),
          ...((!values.condition?.threshold ||
            +values.condition.threshold < 0) && {
            condition: {
              threshold: true,
            },
          }),
        },
      };
    },
  });

  const [formStep, setFormStep] = useAlertFormStep('price');

  useEffect(() => {
    setFormStep('price');
    alertForm.reset({
      dataSource: 'market_data',
      messengers: ['EMAIL'],
      ...alertItem,
      params: {
        market_name: 'BINANCE',
        market_type: 'SPOT',
        quote: 'USDT',
        ...alertItem?.params,
      },
      config: {
        dnd_interval: 3600,
        one_time: false,
        ...alertItem?.config,
      },
      condition: {
        field_name: 'last_price',
        threshold: '0.0',
        operator: 'GREATER',
        ...alertItem?.condition,
      },
    });
  }, [isOpen, alertItem, setFormStep, alertForm]);

  return (
    <DrawerModal
      open={isOpen}
      onClose={onClose}
      destroyOnClose
      className="mobile:!h-[85svh]"
      title={
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center justify-between gap-4">
            {formStep === 'notification' && (
              <Button
                variant="alternative"
                onClick={() => {
                  if (!alertForm.formState.isValid) {
                    alertForm.resetField('messengers');
                  }
                  setFormStep('price');
                }}
                className="!size-12 !p-0"
              >
                <Icon name={bxChevronLeft} />
              </Button>
            )}
            {showLink && (
              <Link to="/account/notification-center?tab=alerts">
                <Button variant="alternative" className="!px-4">
                  {t('alerts.title')}
                </Button>
              </Link>
            )}
          </div>
          <Button
            variant="alternative"
            className="!size-12 !p-0"
            onClick={onClose}
          >
            <Icon name={bxX} />
          </Button>
        </div>
      }
      closable={false}
    >
      <form
        className={clsx(
          'mx-auto flex max-w-md flex-col items-stretch gap-8 mobile:max-h-[calc(100vh-10rem)]',
          loading && 'pointer-events-none animate-pulse',
        )}
        onSubmit={alertForm.handleSubmit(dto => {
          onSubmit?.(dto);
          return Promise.resolve();
        })}
      >
        <AlertFormStep step={formStep} className="mx-auto mb-8" />

        {/* Price Inputs */}
        <div
          className={clsx(
            'max-w-md text-center text-base font-normal leading-[3.8rem]',
            formStep === 'notification' && 'hidden',
          )}
        >
          <Trans
            i18nKey="alerts.sentences.price-alert"
            ns="notifications"
            components={{
              Badge: <FormControlWithLabel type="inline" />,
              Br: <br />,
              Base: (
                <Controller
                  control={alertForm.control}
                  name="params.base"
                  render={({ field: { value, onChange } }) => (
                    <PairBaseSelect
                      className="inline-block min-w-20"
                      onChange={onChange}
                      value={value}
                      disabled={
                        alertItem?.params?.base !== undefined && assetLock
                      }
                    />
                  )}
                />
              ),
              Operator: (
                <Controller
                  control={alertForm.control}
                  name="condition.operator"
                  render={({ field: { value, onChange } }) => (
                    <OperatorSelect
                      onChange={onChange}
                      value={value}
                      showEqual={false}
                    />
                  )}
                />
              ),
              Threshold: (
                <Controller
                  control={alertForm.control}
                  name="condition.threshold"
                  render={({ field: { value, onChange } }) => (
                    <PriceInput
                      onChange={onChange}
                      value={value || ''}
                      placeholder="Price"
                      className="inline-block w-32"
                      required
                    />
                  )}
                />
              ),
              Quote: (
                <Controller
                  control={alertForm.control}
                  name="params.quote"
                  render={({ field: { value, onChange } }) => (
                    <PairQuoteSelect
                      value={value}
                      onChange={onChange}
                      disabled={
                        alertItem?.params?.quote !== undefined && assetLock
                      }
                    />
                  )}
                />
              ),
              Exchange: (
                <Controller
                  control={alertForm.control}
                  name="params.market_name"
                  render={({ field: { value, onChange } }) => (
                    <ExchangeSelect
                      onChange={onChange}
                      value={value}
                      marketType={alertItem?.params?.market_type || 'SPOT'}
                    />
                  )}
                />
              ),
            }}
          />
          {alertItem?.params?.base && (
            <CoinPriceInfo slug={alertItem?.params?.base} />
          )}
        </div>

        {/* Notification Inputs */}
        <div
          className={clsx(
            'space-y-4 text-base font-normal',
            formStep === 'price' && 'hidden',
          )}
        >
          <FormControlWithLabel
            label={t('alerts.form.alert-channel')}
            type="normal"
          >
            <Controller
              control={alertForm.control}
              name="messengers"
              render={({ field: { value, onChange } }) => (
                <AlertChannelsSelect
                  onChange={onChange}
                  value={value}
                  className="h-36"
                />
              )}
            />
          </FormControlWithLabel>

          <FormControlWithLabel
            label={t('alerts.form.cooldown')}
            type="normal"
            info={t('alerts.form.cooldown-info')}
          >
            <Controller
              control={alertForm.control}
              name="config.dnd_interval"
              render={({ field: { value, onChange } }) => (
                <IntervalSelect
                  onChange={onChange}
                  value={value}
                  className="block"
                  cooldownMode
                />
              )}
            />
          </FormControlWithLabel>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-stretch gap-2">
          <Button
            variant="primary-purple"
            className={clsx('grow', formStep === 'notification' && 'hidden')}
            disabled={!alertForm.formState.isValid}
            onClick={e => {
              e.preventDefault();
              setFormStep('notification');
            }}
          >
            {t('alerts.form.next')}
            <Icon name={bxRightArrowAlt} className="ms-2" />
          </Button>
          <Button
            variant="primary-purple"
            className={clsx('grow', formStep === 'price' && 'hidden')}
            loading={loading}
            disabled={!alertForm.formState.isValid}
          >
            {t('alerts.form.set-alert')}
            <Icon name={bxBell} className="ms-2" />
          </Button>
        </div>

        {/* Trigger Once Toggle */}
        <FormControlWithLabel
          label={t('alerts.form.disable-after-trigger')}
          type="box"
          className={clsx(formStep === 'price' && 'hidden')}
        >
          <Controller
            control={alertForm.control}
            name="config.one_time"
            render={({ field: { value, onChange } }) => (
              <Toggle onChange={onChange} checked={value} />
            )}
          />
        </FormControlWithLabel>

        <hr className="opacity-5" />

        <AlertSubscriptionBanner className="mx-auto" />
      </form>
    </DrawerModal>
  );
}

export * from 'shared/DrawerModal';
export * from './AlertFormStep';
export * from './PairBaseSelect';
export * from './OperatorSelect';
export * from './PairQuoteSelect';
export * from './ExchangeSelect';
export * from './IntervalSelect';
export * from './AlertChannelsSelect';
export * from './PriceInput';
export * from './CoinPriceInfo';
export * from './AlertSubscriptionBanner';
export * from './useAlertConfirmModal';
export * from './AlertStateInput';
