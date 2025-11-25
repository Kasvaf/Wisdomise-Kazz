import { clsx } from 'clsx';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { SocialMessage } from 'services/rest/discovery';
import { ReadableDate } from 'shared/ReadableDate';
import { Dialog } from 'shared/v1-components/Dialog';
import useIsMobile from 'utils/useIsMobile';
import { SocialLogo } from '../SocialLogo';
import { LongIcon, ShortIcon } from './icons';
import { SocialMessageContent } from './SocialMessageContent';
import { SocialMessageImage } from './SocialMessageImage';
import { SocialMessageReadMore } from './SocialMessageReadMore';
import { SocialMessageStats } from './SocialMessageStats';
import { SocialMessageUser } from './SocialMessageUser';
import { useSocialMessage } from './useSocialMessage';

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
          'scrollbar-none overflow-auto',
          'flex w-full max-w-full mobile:items-start items-stretch justify-between gap-4',
          'flex-row mobile:flex-col rounded-lg bg-v1-surface-l-next p-3',
          className,
        )}
      >
        <SocialMessageImage
          className="h-36 mobile:h-40 mobile:w-full w-60 shrink-0 overflow-hidden rounded-lg bg-white"
          message={message}
        />
        <div className="flex h-36 grow flex-col justify-between gap-4 py-1">
          <div className="grow space-y-4">
            <div className="flex items-center gap-1">
              <ReadableDate
                className="inline-flex h-4 items-center justify-center rounded-lg bg-v1-surface-l3 px-2 text-xxs"
                format="MMM D, YYYY h:mm A"
                popup={false}
                value={fields.releasedDate}
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
              className="max-h-16"
              message={message}
              mode={
                message.social_type === 'trading_view' ? 'title' : 'summary'
              }
              onReadMore={() => setOpen(true)}
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <SocialMessageUser message={message} type="title" />
            <div className="flex items-center justify-end gap-2">
              {message.social_type !== 'trading_view' && (
                <SocialLogo className="size-6" type={message.social_type} />
              )}
              <SocialMessageStats message={message} />
              <SocialMessageReadMore onClick={() => setOpen(true)} />
            </div>
          </div>
        </div>
      </div>
      <Dialog
        closable
        contentClassName="p-3"
        drawerConfig={{
          position: 'bottom',
        }}
        header={t('social-messages.post_details')}
        mode={isMobile ? 'drawer' : 'modal'}
        onClose={() => setOpen(false)}
        open={open}
        surface={2}
      >
        <SocialMessageDetails message={message} />
      </Dialog>
    </>
  );
}

function SocialMessageDetails({
  message,
  className,
}: {
  message: SocialMessage;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        'flex max-h-[70vh] flex-col items-start gap-2 overflow-auto',
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
            className="shrink-0"
            message={message}
            type="large-title"
          />
        </div>
        <div className="flex items-center gap-3">
          <SocialMessageStats message={message} />
        </div>
      </div>
      <SocialMessageImage
        className="h-auto w-full shrink-0 object-contain"
        message={message}
      />
      <SocialMessageContent
        className="w-full shrink-0"
        message={message}
        mode="full"
      />
    </div>
  );
}
