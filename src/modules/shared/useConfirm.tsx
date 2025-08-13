import { clsx } from 'clsx';
import type React from 'react';
import { useCallback, type ReactElement } from 'react';
import { bxInfoCircle } from 'boxicons-quasar';
import { type ModalProps } from 'antd';
import useModal from './useModal';
import Button from './Button';
import Icon from './Icon';

interface Props {
  title?: string | React.ReactNode;
  icon?: ReactElement<any, any> | null;
  message?: string | ReactElement<any, any>;
  yesTitle?: string | ReactElement<any, any>;
  noTitle?: string | ReactElement<any, any>;
  onResolve?: (confirmed: boolean) => void;
}

interface ButtonOptions {
  title: string;
  variant: 'primary' | 'alternative' | 'secondary' | 'link';
  onClick: () => void;
}

const ConfirmModal: React.FC<Props> = ({
  title,
  icon = (
    <Icon name={bxInfoCircle} className="text-v1-content-notice/70" size={52} />
  ),
  message,
  yesTitle,
  noTitle,
  onResolve,
}) => {
  const buttons = [
    {
      title: noTitle,
      variant: 'secondary',
      onClick: () => onResolve?.(false),
    },
    {
      title: yesTitle,
      variant: 'primary',
      onClick: () => onResolve?.(true),
    },
  ].filter(x => x.title) as ButtonOptions[];

  return (
    <div className="text-white">
      {title && <div className="mb-8 text-center font-semibold">{title}</div>}
      {icon && <div className="mb-8 flex justify-center">{icon}</div>}
      <div className="text-white/80">{message}</div>

      {buttons.length > 0 && (
        <div
          className={clsx(
            '-mx-3 mt-8 flex',
            buttons.length < 2 ? 'justify-center' : 'justify-stretch',
          )}
        >
          {buttons.map(({ title, variant, onClick }) => (
            <Button
              key={title}
              className="mx-3 basis-1/2"
              variant={variant}
              onClick={onClick}
            >
              {title}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

function useConfirm(
  p: Omit<Props, 'onResolve'>,
  config?: ModalProps,
): [JSX.Element, (po?: Partial<Props>) => Promise<boolean>] {
  const [Component, update] = useModal(ConfirmModal, config);
  return [
    Component,
    useCallback(
      async po => Boolean(await update({ ...p, ...po })),
      [p, update],
    ),
  ];
}

export default useConfirm;
