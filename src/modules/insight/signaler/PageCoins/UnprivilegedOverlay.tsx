import { Trans, useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { bxRightArrowAlt } from 'boxicons-quasar';
import { usePlansQuery } from 'api';
import Icon from 'shared/Icon';
import { ReactComponent as LockIcon } from './lock.svg';

const UnprivilegedOverlay: React.FC<{ requiredLevel: number }> = ({
  requiredLevel,
}) => {
  const { t } = useTranslation('billing');
  const { data: plans } = usePlansQuery();
  const level = plans?.results.find(x => x.level === requiredLevel)?.name;

  return (
    <Link
      to="/account/billing"
      className="flex items-center justify-center gap-4 px-4 text-white hover:text-info"
    >
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/5">
        <LockIcon />
      </div>
      <div className="mt-2">
        <div className="flex items-center font-semibold">
          {t('overlay-subscription.strategy.title')}
          <Icon name={bxRightArrowAlt} />
        </div>
        <div className="font-light">
          <Trans
            ns="billing"
            i18nKey="overlay-subscription.strategy.description"
          >
            To reveal this strategy, you need to have{' '}
            <span className="font-semibold">{{ level }}</span> or a higher plan
          </Trans>
        </div>
      </div>
    </Link>
  );
};

export default UnprivilegedOverlay;
