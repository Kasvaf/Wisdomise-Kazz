import { bxChevronDown } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import Icon from 'shared/Icon';

export function ExpandButton({
  value,
  onClick,
}: {
  value: boolean;
  onClick: () => void;
}) {
  const { t } = useTranslation('market-pulse');
  return (
    <button
      className="inline-flex items-center gap-1 text-xs text-v1-content-link"
      onClick={() => onClick()}
    >
      {value ? t('common.hide') : t('common.show')}
      <Icon
        name={bxChevronDown}
        className={clsx('transition-transform', value && 'rotate-180')}
        strokeWidth={0.001}
      />
    </button>
  );
}
