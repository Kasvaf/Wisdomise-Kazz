import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { type LastPosition } from 'api/types/signalResponse';
import { type BadgeColors } from 'shared/Badge';

export type Suggestions = LastPosition['suggested_action'];

export const useSuggestionsMap = () => {
  const { t } = useTranslation('strategy');
  return useMemo(() => {
    const suggestions: Record<
      Suggestions,
      {
        label: string;
        color: BadgeColors;
        greyTitle?: boolean;
      }
    > = {
      OPEN: {
        color: 'green',
        label: t('matrix.suggest.open'),
      },
      OPEN_DELAYED: {
        color: 'green',
        label: t('matrix.suggest.open'),
      },
      CLOSE: {
        color: 'red',
        label: t('matrix.suggest.close'),
      },
      CLOSE_DELAYED: {
        color: 'grey',
        label: t('matrix.suggest.close'),
        greyTitle: true,
      },
      NO_ACTION: {
        color: 'white',
        label: t('matrix.suggest.no-action'),
        greyTitle: true,
      },
    };
    return suggestions;
  }, [t]);
};
