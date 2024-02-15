import { Trans } from 'react-i18next';
import { type PlanPeriod } from 'api/types/subscription';

export default function Periodicity({
  periodicity,
}: {
  periodicity: PlanPeriod;
}) {
  return periodicity === 'MONTHLY' ? (
    <Trans i18nKey="periodicity.month.per" ns="billing">
      per <br /> period
    </Trans>
  ) : (
    <Trans i18nKey="periodicity.year.per" ns="billing">
      per <br /> period
    </Trans>
  );
}
