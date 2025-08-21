import type { Alert } from 'api/alert';
import { useMemo } from 'react';
import type { AlertForm, AlertFormGroup } from '../library/types';
import { usePriceAlert } from './price';
import { useScreenerAlert } from './screener';
import { useWhaleAlert } from './whale';

export const useAlertForms = (): Array<AlertForm | AlertFormGroup> => {
  const priceAlert = usePriceAlert();
  const screenerAlert = useScreenerAlert();
  const whaleAlert = useWhaleAlert();

  const grouped = useMemo(
    () => [priceAlert, screenerAlert, whaleAlert],
    [priceAlert, screenerAlert, whaleAlert],
  );

  return grouped;
};

export const useAlertForm = (input?: AlertForm['value'] | Partial<Alert>) => {
  const alertForms = useAlertForms();
  if (!input) return;
  const flatedForms = alertForms.flatMap(x =>
    'children' in x ? x.children : x,
  );
  if (typeof input === 'string')
    return flatedForms.find(x => x.value === input);
  return flatedForms.find(x => x.isCompatible?.(input));
};
