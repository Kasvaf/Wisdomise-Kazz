import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { useCoinTelegramMessages } from 'api';
import PageWrapper from 'modules/base/PageWrapper';
import { API_ORIGIN } from 'config/constants';
import AuthorizedImage from 'shared/AuthorizedImage';
import { ReactComponent as TelegramIcon } from './images/Telegram.svg';

export default function PageSocialRadarDetail() {
  const { t } = useTranslation('social-radar');
  const params = useParams<{ symbol: string }>();
  const messages = useCoinTelegramMessages(params.symbol || '');

  return (
    <PageWrapper
      loading={messages.isLoading}
      className="leading-none mobile:leading-normal"
    >
      <p className="font-semibold">{t('title')}</p>
      <p className="mt-4 text-sm text-white/60">
        {t('detail-page.subtitle', { symbol: params.symbol })}
      </p>

      <section className="mt-6 columns-2 gap-4 mobile:columns-1">
        {messages.data?.map(msg => (
          <div
            key={msg.key}
            className="mb-4 break-inside-avoid rounded-xl bg-black/10"
          >
            <div className="flex h-12 items-center justify-between rounded-t-xl bg-black/20 pl-6 pr-4">
              <p className="text-sm">{msg.channel_name}</p>

              <div className="flex items-center gap-4">
                <p className="text-xs text-white/40">
                  {dayjs(msg.related_at).format('MMM D , HH:mm')}
                </p>
                <TelegramIcon />
              </div>
            </div>

            <div className="p-4">
              {msg.photo_url && (
                <AuthorizedImage
                  className="mb-2 max-h-[700px] w-full rounded"
                  src={API_ORIGIN + msg.photo_url}
                />
              )}
              <pre className="overflow-hidden whitespace-pre-line text-xs text-white/60">
                {msg.message_text}
              </pre>
            </div>
          </div>
        ))}
      </section>
    </PageWrapper>
  );
}
