import { bxChevronDown, bxChevronUp } from 'boxicons-quasar';
import { useState, type PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import Button from 'shared/Button';
import Icon from 'shared/Icon';

const ClosablePart: React.FC<
  PropsWithChildren<{
    title: string;
    onReset?: () => any;
  }>
> = ({ title, onReset, children }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="overflow-hidden rounded-xl bg-black/30">
      <div className="flex items-center justify-between bg-black/10 px-3 py-4">
        <div className="flex items-center gap-2 pl-2">
          <div className="text-lg">{title}</div>
          {onReset && (
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
          <Button
            variant="link"
            className="!p-0"
            onClick={() => setIsOpen(x => !x)}
          >
            <Icon name={isOpen ? bxChevronUp : bxChevronDown} />
          </Button>
        </div>
      </div>

      <div className={isOpen ? 'flex flex-col gap-4 px-3 pb-3' : 'hidden'}>
        {children}
      </div>
    </div>
  );
};

export default ClosablePart;
