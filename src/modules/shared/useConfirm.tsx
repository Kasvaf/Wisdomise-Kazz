import { clsx } from 'clsx';
import type React from 'react';
import { type ReactElement } from 'react';
import { ReactComponent as WarningIcon } from '@images/warningCircle.svg';
import Button from './Button';
import useModal from './useModal';

interface Props {
  icon?: ReactElement<any, any> | null;
  message?: string | ReactElement<any, any>;
  yesTitle?: string;
  noTitle?: string;
  onResolve?: (confirmed: boolean) => void;
}

interface ButtonOptions {
  title: string;
  variant: 'primary' | 'alternative' | 'secondary' | 'link';
  onClick: () => void;
}

const ConfirmModal: React.FC<Props> = ({
  icon = <WarningIcon className="h-12 w-12" />,
  message,
  yesTitle,
  noTitle,
  onResolve,
}) => {
  const buttons = [
    {
      title: noTitle,
      variant: 'alternative',
      onClick: () => onResolve?.(false),
    },
    {
      title: yesTitle,
      variant: 'primary',
      onClick: () => onResolve?.(true),
    },
  ].filter(x => x.title) as ButtonOptions[];

  return (
    <div>
      {icon && <div className="mb-8 flex justify-center">{icon}</div>}
      <div className="mb-8 text-white/80">{message}</div>

      {buttons.length > 0 && (
        <div
          className={clsx(
            '-mx-3 flex',
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
): [React.FC, (po?: Partial<Props>) => Promise<boolean>] {
  const [Component, update] = useModal(ConfirmModal);
  return [Component, async po => Boolean(await update({ ...p, ...po }))];
}

export default useConfirm;
