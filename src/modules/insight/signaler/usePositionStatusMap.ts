import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const usePositionStatusMap = () => {
  const { t } = useTranslation('strategy');

  return useMemo(
    () =>
      ({
        OPENING: {
          color: 'green',
          label: t('status.opening'),
        },
        OPEN: {
          color: 'green',
          label: t('status.open'),
        },
        CLOSING: {
          color: 'red',
          label: t('status.closing'),
        },
        CLOSED: {
          color: 'red',
          label: t('status.closed'),
        },
        CANCELLED: {
          color: 'grey',
          label: t('status.canceled'),
        },
      }) as const,
    [t],
  );
};

export default usePositionStatusMap;
