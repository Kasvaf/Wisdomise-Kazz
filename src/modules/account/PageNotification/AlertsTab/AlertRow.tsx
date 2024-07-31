import { Trans } from 'react-i18next';
import { clsx } from 'clsx';
import { useState, type FC, type ReactNode } from 'react';
import { bxEdit, bxTrash } from 'boxicons-quasar';
import {
  type Alert,
  type AlertDataSource,
  useDeleteAlert,
  useSaveAlert,
} from 'api/alert';
import { ReadableNumber } from 'shared/ReadableNumber';
import FabButton from 'shared/FabButton';
import { unwrapErrorMessage } from 'utils/error';
import {
  AlertChannel,
  AlertSaveModal,
  AlertStateInput,
  ExchangeSelect,
  OperatorSelect,
  PairBaseSelect,
  PairQuoteSelect,
  useAlertDeleteConfirm,
  useAlertSaveToast,
} from './AlertSaveModal';

const RowButton: FC<{
  onClick?: () => void;
  icon: string;
  disabled?: boolean;
  loading?: boolean;
}> = ({ onClick, icon, disabled, loading }) => (
  <FabButton
    disabled={disabled || loading}
    icon={icon}
    className={clsx(
      'inline-flex !size-9 items-center justify-center !bg-white/10 !text-white/80 transition-all duration-100',
      disabled ? 'opacity-30' : 'hover:!bg-white hover:!text-black/90',
      loading && '!animate-pulse cursor-wait',
    )}
    onClick={onClick}
    size={18}
  />
);

const RowBadge: FC<{ children?: ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <div
    className={clsx(
      'inline-flex h-9 items-center justify-center gap-2 rounded bg-white/5',
      'px-2 text-xs text-white',
      '[&_.ant-select-selector]:!bg-transparent [&_.ant-select-selector]:!p-0',
      className,
    )}
  >
    {children}
  </div>
);

export function AlertRow<D extends AlertDataSource>({
  alert: alertItem,
  rank,
  className,
}: {
  alert: Alert<D>;
  rank: number;
  className?: string;
}) {
  const saveAlertMutation = useSaveAlert(alertItem.key as string);
  const deleteAlertMutation = useDeleteAlert(alertItem.key as string);
  const [deleteConfirmModal, showDeleteConfirm] = useAlertDeleteConfirm();
  const [saveToast, showSaveToast] = useAlertSaveToast();
  const [isEditing, setIsEditing] = useState(false);
  if (alertItem.dataSource !== 'market_data') return null;

  return (
    <>
      <div
        className={clsx(
          'flex items-center justify-start gap-8 rounded-xl bg-black/20 p-6 pt-3 max-md:flex-col',
          className,
        )}
      >
        <b className="me-2 inline-flex size-6 items-center justify-center rounded-full bg-black/40">
          {rank}
        </b>
        <div className="max-w-lg grow leading-[2.8rem]">
          <Trans
            i18nKey="alerts.sentences.price-alert"
            ns="notifications"
            components={{
              Br: <i />,
              Badge: <RowBadge />,
              Base: alertItem.params?.base ? (
                <PairBaseSelect
                  value={alertItem.params?.base}
                  disabled
                  className="!px-0"
                />
              ) : (
                <span className="opacity-60" />
              ),
              Operator: alertItem.condition?.operator ? (
                <OperatorSelect
                  value={alertItem.condition?.operator}
                  disabled
                  showEqual
                />
              ) : (
                <span className="opacity-60" />
              ),
              Threshold: alertItem.condition?.threshold ? (
                <ReadableNumber value={+alertItem.condition?.threshold} />
              ) : (
                <span className="opacity-60" />
              ),
              Quote: alertItem.params?.quote ? (
                <PairQuoteSelect value={alertItem.params?.quote} disabled />
              ) : (
                <span className="opacity-60" />
              ),
              Exchange:
                alertItem.params?.market_name &&
                alertItem.params?.market_type ? (
                  <ExchangeSelect
                    value={alertItem.params.market_name}
                    marketType={alertItem.params.market_type}
                    disabled
                  />
                ) : (
                  <span className="opacity-60" />
                ),
            }}
          />
        </div>
        <div className="grow" />
        <div className="flex shrink-0 flex-wrap items-center gap-4">
          {alertItem.messengers?.map(messanger => (
            <RowBadge key={messanger}>
              <AlertChannel name={messanger} />
            </RowBadge>
          ))}
          <span className="opacity-5">|</span>
          <AlertStateInput
            value={alertItem.state}
            onChange={newState =>
              saveAlertMutation.mutateAsync({
                ...alertItem,
                state: newState,
              })
            }
            loading={saveAlertMutation.isLoading}
          />
          <RowButton
            icon={bxEdit}
            onClick={() => setIsEditing(true)}
            loading={isEditing}
          />
          <RowButton
            icon={bxTrash}
            loading={deleteAlertMutation.isLoading}
            onClick={() => {
              void showDeleteConfirm().then(confirmed => {
                if (!confirmed) return;
                return deleteAlertMutation.mutateAsync();
              });
            }}
          />
        </div>
      </div>
      <AlertSaveModal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        alert={alertItem}
        onSubmit={dto =>
          saveAlertMutation
            .mutateAsync(dto)
            .then(() => {
              setIsEditing(false);
              return showSaveToast();
            })
            .catch(error => {
              alert(unwrapErrorMessage(error));
              throw error;
            })
        }
        loading={saveAlertMutation.isLoading}
      />
      {deleteConfirmModal}
      {saveToast}
    </>
  );
}
