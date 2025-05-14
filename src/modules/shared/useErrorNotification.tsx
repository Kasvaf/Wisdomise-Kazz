import useNotification from 'antd/es/notification/useNotification';
import { FetchError } from 'ofetch';
import { type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { BaseError } from 'viem';

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
        if (error instanceof FetchError) {
          const { statusText, data } = error;
          if (statusText === 'ERR_NETWORK') {
            returnValue = {
              ...returnValue,
              description: <>{t('errors.network-error')}</>,
            };
          } else if (data.message) {
            returnValue = {
              ...returnValue,
              description: <>{data.message}</>,
            };
          } else if (typeof data === 'object' && data !== null) {
            returnValue = {
              ...returnValue,
              description: (
                <>
                  {Object.entries(data).map(([field, fieldError], index) => (
                    <div key={`${field}-${index}`}>
                      {`${field}: ${
                        Array.isArray(fieldError)
                          ? fieldError.join(', ')
                          : fieldError?.toString() || t('errors.field-required')
                      }`}
                    </div>
                  ))}
                </>
              ),
            };
          }
        } else if (error instanceof BaseError) {
          returnValue = {
            message: error.name,
            description: error.message.split('.')[0],
          };
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
