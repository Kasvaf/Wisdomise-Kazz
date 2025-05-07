import { clsx } from 'clsx';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type SocialMessage } from 'api';
import useIsMobile from 'utils/useIsMobile';
import { ReadableDate } from 'shared/ReadableDate';
import { Dialog } from 'shared/v1-components/Dialog';
import { SocialLogo } from '../SocialLogo';
import { SocialMessageImage } from './SocialMessageImage';
import { SocialMessageContent } from './SocialMessageContent';
import { SocialMessageUser } from './SocialMessageUser';
import { SocialMessageStats } from './SocialMessageStats';
import { useSocialMessage } from './useSocialMessage';
import { LongIcon, ShortIcon } from './icons';
import { SocialMessageReadMore } from './SocialMessageReadMore';

export function SocialMessageSummary({
  message,
  className,
}: {
  message: SocialMessage;
  className?: string;
}) {
  const { t } = useTranslation('coin-radar');
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const fields = useSocialMessage(message);

  return (
    <>
      <div
        className={clsx(
          'flex w-full max-w-full items-stretch justify-between gap-4 mobile:items-start',
          'flex-row rounded-lg p-3 bg-v1-surface-l-next mobile:flex-col',
          className,
        )}
      >
        <SocialMessageImage
          message={message}
          className="h-40 w-64 shrink-0 overflow-hidden rounded-lg bg-white mobile:h-40 mobile:w-full"
        />
        <div className="flex h-40 grow flex-col justify-between gap-4 py-5">
          <div className="grow space-y-4">
            <div className="flex items-center gap-1">
              <ReadableDate
                format="MMM D, YYYY h:mm A"
                value={fields.releasedDate}
                className="inline-flex h-4 items-center justify-center rounded-lg bg-v1-surface-l3 px-2 text-xxs"
                popup={false}
              />
              {typeof fields.side === 'string' && (
                <span
                  className={clsx(
                    'flex size-4 shrink-0 items-center justify-center rounded-full [&_svg]:size-2',
                    fields.side === 'SHORT'
                      ? 'bg-v1-content-negative/10'
                      : 'bg-v1-content-positive/10',
                  )}
                >
                  {fields.side === 'SHORT' ? <ShortIcon /> : <LongIcon />}
                </span>
              )}
            </div>
            <SocialMessageContent
              message={message}
              mode={
                message.social_type === 'trading_view' ? 'title' : 'summary'
              }
              onReadMore={() => setOpen(true)}
              className="max-h-16"
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <SocialMessageUser message={message} type="title" />
            <div className="flex items-center justify-end gap-2">
              {message.social_type !== 'trading_view' && (
                <SocialLogo type={message.social_type} className="size-6" />
              )}
              <SocialMessageStats message={message} />
              <SocialMessageReadMore onClick={() => setOpen(true)} />
            </div>
          </div>
        </div>
      </div>
      <Dialog
        mode={isMobile ? 'drawer' : 'modal'}
        drawerConfig={{
          position: 'bottom',
        }}
        surface={2}
        open={open}
        onClose={() => setOpen(false)}
        closable
        header={t('social-messages.post_details')}
        contentClassName="p-3"
      >
        <SocialMessageDetails message={message} />
      </Dialog>
    </>
  );
}

export function SocialMessageDetails({
  message,
  className,
}: {
  message: SocialMessage;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        'flex max-h-[70vh] flex-col items-start gap-4 overflow-auto',
        className,
      )}
    >
      <div className="flex w-full items-center justify-between gap-2">
        <div className="flex grow items-center gap-2">
          {message.social_type !== 'trading_view' && (
            <SocialLogo
              className="size-8 shrink-0"
              type={message.social_type}
            />
          )}
          <SocialMessageUser
            message={message}
            type="large-title"
            className="shrink-0"
          />
        </div>
        <div className="flex items-center gap-3">
          <SocialMessageStats message={message} />
        </div>
      </div>
      <SocialMessageImage
        message={message}
        className="h-auto w-full shrink-0 object-contain"
      />
      <SocialMessageContent
        message={message}
        mode="full"
        className="w-full shrink-0"
      />
    </div>
  );
}
