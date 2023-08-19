import type React from 'react';
import { type ReactElement } from 'react';
import { ReactComponent as WarningIcon } from '@images/warningCircle.svg';
import { Button } from './Button';
import useModal from './useModal';

interface Props {
  icon?: ReactElement<any, any> | null;
  message?: string | ReactElement<any, any>;
  yesTitle: string;
  noTitle: string;
  onResolve?: (confirmed: boolean) => void;
}

const ConfirmModal: React.FC<Props> = ({
  icon = <WarningIcon className="h-12 w-12" />,
  message,
  yesTitle,
  noTitle,
  onResolve,
}) => {
  return (
    <div>
      {icon && <div className="mb-8 flex justify-center">{icon}</div>}
      <div className="mb-8 text-white/80">{message}</div>

      {(yesTitle || noTitle) && (
        <div className="flex justify-stretch">
          <Button
            className="basis-1/2"
            variant="alternative"
            onClick={() => onResolve?.(false)}
          >
            {noTitle}
          </Button>
          <div className="w-6" />
          <Button
            className="basis-1/2"
            variant="primary"
            onClick={() => onResolve?.(true)}
          >
            {yesTitle}
          </Button>
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
