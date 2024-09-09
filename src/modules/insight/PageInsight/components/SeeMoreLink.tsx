import { bxRightArrowAlt } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { Link, type LinkProps } from 'react-router-dom';
import Icon from 'shared/Icon';

export function SeeMoreLink({
  className,
  ...props
}: Omit<LinkProps, 'children'>) {
  const { t } = useTranslation('common');

  return (
    <Link
      {...props}
      className={clsx(
        'inline-flex items-center gap-1 text-xs text-v1-content-link hover:text-v1-content-link-hover active:text-v1-content-link-pressed',
        className,
      )}
    >
      <span className="mobile:hidden">{t('see-more')}</span>
      <Icon name={bxRightArrowAlt} size={22} />
    </Link>
  );
}
