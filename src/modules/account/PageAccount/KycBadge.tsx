import { useTranslation } from 'react-i18next';
import { type FC } from 'react';
import { type useSumsubVerified } from 'api';
import { CardPageLinkBadge } from '../../shared/CardPageLinkV2';

const KycBadge: FC<{
  status: ReturnType<typeof useSumsubVerified>['data'];
}> = ({ status }) => {
  const { t } = useTranslation('kyc');
  const statusMap = {
    UNVERIFIED: t('badges.unverified'),
    PENDING: t('badges.pending'),
    VERIFIED: t('badges.verified'),
    REJECTED: t('badges.rejected'),
  };
  return (
    <CardPageLinkBadge color={status === 'VERIFIED' ? 'green' : 'orange'}>
      {statusMap[status || 'PENDING']}
    </CardPageLinkBadge>
  );
};

export default KycBadge;
