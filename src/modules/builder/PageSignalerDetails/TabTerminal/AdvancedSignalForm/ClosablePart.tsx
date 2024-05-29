import { Switch } from 'antd';
import { type PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import Button from 'shared/Button';

const ClosablePart: React.FC<
  PropsWithChildren<{
    title: string;
    switchTitle?: string;
    isOpen?: boolean;
    onIsOpenChanged?: (val: boolean) => any;
    onReset?: () => any;
  }>
> = ({ title, isOpen = true, onIsOpenChanged, onReset, children }) => {
  const { t } = useTranslation();
  return (
    <div className="overflow-hidden rounded-xl bg-black/30">
      <div className="flex items-center justify-between bg-black/10 px-3 py-4">
        <div className="flex items-center gap-2 pl-2">
          <div className="text-lg">{title}</div>
          {isOpen && onReset && (
            <Button
              variant="link"
              className="!p-0 text-xxs text-white/50"
              onClick={onReset}
            >
              {t('common:actions.reset')}
            </Button>
          )}
        </div>

        <div className="flex items-center gap-1">
          {onIsOpenChanged && (
            <Switch onChange={onIsOpenChanged} checked={isOpen} />
          )}
        </div>
      </div>

      {isOpen && (
        <div className="flex flex-col gap-4 px-3 pb-3">{children}</div>
      )}
    </div>
  );
};

export default ClosablePart;
