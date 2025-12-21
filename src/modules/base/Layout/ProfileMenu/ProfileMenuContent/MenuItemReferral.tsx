import { useTranslation } from 'react-i18next';
import { useReferralStatusQuery } from 'services/rest';
import { Badge } from 'shared/v1-components/Badge';
import BoxedIcon from './BoxedIcon';
import { IconReferral } from './icons';
import MenuItem from './MenuItem';

const MenuItemReferral = () => {
  const { t } = useTranslation('base');
  const { data: referral } = useReferralStatusQuery();

  return (
    <MenuItem to="/account/referral">
      <BoxedIcon icon={IconReferral} />
      {t('menu.referral.title')}

      {!Number.isNaN(referral?.referred_users_count) && referral != null && (
        <Badge color="info">
          {t('accounts:page-accounts.users_invited', {
            count: referral?.referred_users_count || 0,
          })}
        </Badge>
      )}
    </MenuItem>
  );
};

export default MenuItemReferral;
