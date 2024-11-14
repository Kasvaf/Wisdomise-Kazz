import { useMemo } from 'react';
import { type Alert } from 'api/alert';
import { type AlertForm } from '../library/types';
import { useIndicatorAlert } from './indicator';
import { usePriceAlert } from './price';
import { useReportAlert } from './report';
import { useScreenerAlert } from './screener';
import { useSentimentAlert } from './sentiment';
import { useSignalerAlert } from './signaler';
import { useWhaleAlert } from './whale';

export const useAlertForms = (): AlertForm[] => {
  const priceAlert = usePriceAlert();
  const screenerAlert = useScreenerAlert();
  const reportAlert = useReportAlert();
  const whaleAlert = useWhaleAlert();
  const indicatorAlert = useIndicatorAlert();
  const sentimentAlert = useSentimentAlert();
  const signalerAlert = useSignalerAlert();

  return useMemo(
    () => [
      screenerAlert,
      whaleAlert,
      priceAlert,
      reportAlert,
      indicatorAlert,
      sentimentAlert,
      signalerAlert,
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
};

export const useAlertForm = (input?: AlertForm['value'] | Partial<Alert>) => {
  const alertForms = useAlertForms();
  if (!input) return;
  if (typeof input === 'string') return alertForms.find(x => x.value === input);
  return alertForms.find(x => x.isCompatible?.(input));
};
