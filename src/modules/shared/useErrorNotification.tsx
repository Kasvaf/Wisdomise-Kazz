import useNotification from 'antd/es/notification/useNotification';
import { isAxiosError } from 'axios';
import { type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

export const useErrorNotification = () => {
  const [notif, notifContent] = useNotification();
  const { t } = useTranslation('common');
  return [
    (error?: unknown) => {
      const content = (() => {
        let returnValue: {
          message: ReactNode;
          description: ReactNode;
        } = {
          message: <>{t('error')}</>,
          description: null,
        };
        if (isAxiosError(error)) {
          const { response, code } = error;
          if (code === 'ERR_NETWORK') {
            returnValue = {
              ...returnValue,
              description: <>{t('errors.network-error')}</>,
            };
          } else if (response?.data.message) {
            returnValue = {
              ...returnValue,
              description: <>{response?.data.message}</>,
            };
          } else if (
            typeof response?.data === 'object' &&
            response.data !== null
          ) {
            returnValue = {
              ...returnValue,
              description: (
                <>
                  {Object.entries(response.data).map(
                    ([field, fieldError], index) => (
                      <div key={`${field}-${index}`}>
                        {`${field}: ${
                          Array.isArray(fieldError)
                            ? fieldError.join(', ')
                            : fieldError?.toString() ||
                              t('errors.field-required')
                        }`}
                      </div>
                    ),
                  )}
                </>
              ),
            };
          }
        }
        return returnValue;
      })();
      notif.error({
        ...content,
        className: content.description
          ? ''
          : '[&_.ant-notification-notice-description]:hidden',
      });
    },
    notifContent,
  ] as const;
};
