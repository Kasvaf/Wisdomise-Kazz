import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { useSubscription } from 'api';
import { ReadableDuration } from 'shared/ReadableDuration';
import { IconSubscription } from './icons';
import BoxedIcon from './BoxedIcon';
import MenuItem from './MenuItem';

const MenuItemSubscription = () => {
  const { t } = useTranslation('base');

  const subscription = useSubscription();
  const isSubPlanActive =
    subscription.status === 'active' ||
    subscription.status === 'trialing' ||
    subscription.status === 'past_due';

  return (
    <MenuItem to="/account/billing">
      <BoxedIcon icon={IconSubscription} />
      {t('menu.billing.title')}

      <div className="text-end">
        <div
          className={clsx(
            'capitalize text-v1-content-brand',
            !isSubPlanActive && 'line-through',
          )}
        >
          {subscription.title}
        </div>

        {subscription.level > 0 &&
          isSubPlanActive &&
          subscription.status !== 'trialing' && (
            <div className="text-xs capitalize">
              <span
                className={clsx(
                  subscription.remaining
                    ? 'text-v1-content-primary'
                    : 'text-v1-content-negative',
                )}
              >
                <ReadableDuration
                  value={subscription.remaining}
                  zeroText={t('pro:zero-hour')}
                />
              </span>
              <span className="ms-1 font-light capitalize text-v1-content-secondary">
                {t('billing:common.remains')}
              </span>
            </div>
          )}
      </div>
    </MenuItem>
  );
};

export default MenuItemSubscription;
