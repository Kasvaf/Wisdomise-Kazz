import { clsx } from 'clsx';
import { Drawer, Modal } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type SocialMessage } from 'api';
import useIsMobile from 'utils/useIsMobile';
import { SocialLogo } from '../SocialLogo';
import { SocialMessageImage } from './SocialMessageImage';
import { SocialMessageContent } from './SocialMessageContent';
import { SocialMessageUser } from './SocialMessageUser';
import { SocialMessageStats } from './SocialMessageStats';

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
  return (
    <>
      {message.social_type === 'trading_view' ? (
        <div
          className={clsx(
            'flex w-full max-w-full items-center justify-between gap-4 bg-v1-surface-l2 mobile:items-start',
            'flex-row mobile:flex-col',
            className,
          )}
        >
          <SocialMessageImage
            message={message}
            className="h-32 w-52 shrink-0 rounded-lg mobile:h-40 mobile:w-full"
          />
          <div className="flex grow flex-col items-stretch justify-between gap-4 mobile:w-full">
            <SocialMessageContent
              message={message}
              mode="title"
              onReadMore={() => setOpen(true)}
              className="shrink-0"
            />

            <div className="flex flex-wrap items-center justify-between gap-4">
              <SocialMessageUser
                message={message}
                type="title"
                className="shrink-0"
              />
            </div>

            <SocialMessageStats
              className="shrink-0 gap-2 text-xs"
              message={message}
              mode="expandable"
              onReadMore={() => setOpen(true)}
            />
          </div>
        </div>
      ) : (
        <div
          className={clsx(
            'flex w-full max-w-full flex-col items-center justify-between mobile:items-start',
            'overflow-hidden rounded-lg bg-v1-surface-l3',
            className,
          )}
        >
          <div className="flex h-11 w-full max-w-full items-center justify-between gap-4 bg-v1-surface-l4 p-3">
            <div className="flex grow items-center gap-2 overflow-hidden">
              <SocialLogo
                className="size-6 shrink-0"
                type={message.social_type}
              />
              <SocialMessageUser
                message={message}
                type="title"
                className="shrink-0 whitespace-nowrap"
              />
            </div>

            <SocialMessageStats
              className="shrink-0 gap-3 text-[11px]"
              message={message}
              mode="normal"
            />
          </div>
          <SocialMessageImage
            message={message}
            className="h-auto w-full shrink-0"
          />
          <div className="w-full p-3">
            <SocialMessageContent
              message={message}
              mode="summary"
              onReadMore={() => setOpen(true)}
              className="shrink-0"
            />
          </div>
        </div>
      )}
      {isMobile ? (
        <Drawer
          placement="bottom"
          open={open}
          onClose={() => setOpen(false)}
          destroyOnClose
          height="auto"
          className="rounded-t-2xl"
          title={t('social-messages.post_details')}
          closable={false}
          style={{
            maxHeight: '90vh',
          }}
        >
          <SocialMessageDetails message={message} />
        </Drawer>
      ) : (
        <Modal
          centered
          open={open}
          onCancel={() => setOpen(false)}
          destroyOnClose
          footer={false}
          closable
          title={t('social-messages.post_details')}
          className="[&_.ant-modal-header]:mb-6 [&_.ant-modal-title]:text-start"
        >
          <SocialMessageDetails message={message} />
        </Modal>
      )}
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
        <SocialMessageStats
          message={message}
          mode="normal"
          className="shrink-0 gap-3 text-xs"
        />
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
