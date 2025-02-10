import { useRef } from 'react';
import { type Alert } from 'api';
import { isMiniApp } from 'utils/version';
import { type AlertFormGroup, type AlertForm } from '../library/types';
import { usePriceAlert } from './price';
import { useReportAlert } from './report';
import { useScreenerAlert } from './screener';
import { useWhaleAlert } from './whale';

export const useAlertForms = (): Array<AlertForm | AlertFormGroup> => {
  const priceAlert = usePriceAlert();
  const screenerAlert = useScreenerAlert();
  const reportAlert = useReportAlert();
  const whaleAlert = useWhaleAlert();

  const grouped = useRef(
    isMiniApp
      ? [screenerAlert, whaleAlert, priceAlert]
      : [screenerAlert, whaleAlert, priceAlert, reportAlert],
  );

  return grouped.current;
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
