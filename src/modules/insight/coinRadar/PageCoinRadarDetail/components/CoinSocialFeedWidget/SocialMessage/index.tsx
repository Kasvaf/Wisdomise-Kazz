import { clsx } from 'clsx';
import { Drawer, Modal } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type SocialMessage } from 'api';
import useIsMobile from 'utils/useIsMobile';
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
      <div
        className={clsx(
          'flex w-full max-w-full items-center justify-between gap-4 bg-v1-surface-l2 mobile:items-start',
          message.social_type === 'trading_view'
            ? 'flex-row mobile:flex-col'
            : 'flex-row-reverse mobile:flex-col',
          className,
        )}
      >
        <SocialMessageImage
          message={message}
          className={clsx(
            'shrink-0 mobile:h-40 mobile:w-full',
            message.social_type === 'trading_view' ? 'h-32 w-52' : 'h-36 w-40',
          )}
        />
        <div className="flex grow flex-col items-stretch justify-between gap-4 mobile:w-full">
          <SocialMessageContent
            message={message}
            mode={message.social_type === 'trading_view' ? 'title' : 'summary'}
            onReadMore={() => setOpen(true)}
            className="shrink-0"
          />

          <div className="flex flex-wrap items-center justify-between gap-4">
            <SocialMessageUser
              message={message}
              type="title"
              className="shrink-0"
            />
            <SocialMessageUser
              message={message}
              type="link"
              className="shrink-0"
            />
          </div>

          <SocialMessageStats
            className="shrink-0"
            message={message}
            mode={
              message.social_type === 'trading_view' ? 'expandable' : 'normal'
            }
            onReadMore={() => setOpen(true)}
          />
        </div>
      </div>
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
      <SocialMessageUser
        message={message}
        type="large-title"
        className="shrink-0"
      />
      <SocialMessageContent
        message={message}
        mode="full"
        className="shrink-0"
      />
      <SocialMessageUser message={message} type="link" className="shrink-0" />
      <SocialMessageImage
        message={message}
        className="h-64 w-full shrink-0 object-contain"
      />
      <SocialMessageStats
        message={message}
        mode="normal"
        className="shrink-0"
      />
    </div>
  );
}
