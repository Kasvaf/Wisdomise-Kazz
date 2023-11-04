import { Trans } from 'react-i18next';
import { type PlanPeriod } from 'api/types/subscription';

const Periodicity: React.FC<{ periodicity: PlanPeriod }> = ({
  periodicity,
}) => (
  <Trans
    i18nKey={
      periodicity === 'MONTHLY'
        ? 'periodicity.month.per'
        : 'periodicity.year.per'
    }
    ns="billing"
  >
    per <br /> period
  </Trans>
);

export default Periodicity;
