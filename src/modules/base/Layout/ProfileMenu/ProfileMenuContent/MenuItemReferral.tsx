import { useTranslation } from 'react-i18next';
import { useReferralStatusQuery } from 'api';
import Badge from 'shared/Badge';
import MenuItem from './MenuItem';
import BoxedIcon from './BoxedIcon';
import { IconReferral } from './icons';

const MenuItemReferral = () => {
  const { t } = useTranslation('base');
  const { data: referral } = useReferralStatusQuery();

  return (
    <MenuItem to="/account/referral">
      <BoxedIcon icon={IconReferral} />
      {t('menu.referral.title')}

      {!Number.isNaN(referral?.referred_users_count) && referral != null && (
        <Badge
          color="blue"
          label={`"${String(referral?.referred_users_count)}" Users Invited`}
        />
      )}
    </MenuItem>
  );
};

export default MenuItemReferral;
