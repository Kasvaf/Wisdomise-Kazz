import { clsx } from 'clsx';
import { useMemo, useState } from 'react';
import { Modal } from 'antd';
import { bxX } from 'boxicons-quasar';
import { type SocialMessage } from 'api';
import { TEMPLE_ORIGIN } from 'config/constants';
import Icon from 'shared/Icon';

export function SocialMessageImage({
  message,
  className,
}: {
  message: SocialMessage;
  className?: string;
}) {
  const [isExpand, setIsExpand] = useState(false);
  const thumbnail = useMemo(() => {
    let ret: string | undefined;
    switch (message.social_type) {
      case 'telegram': {
        ret = message.content.photo_url;
        break;
      }
      case 'reddit': {
        ret = message.content.thumbnail;
        break;
      }
      case 'trading_view': {
        ret = message.content.cover_image_link;
        break;
      }
      case 'twitter': {
        ret =
          typeof message.content.media === 'string'
            ? message.content.media
            : message.content.media?.[0]?.url;
      }
    }
    if (ret) {
      ret = /^http(s?):\/\//.test(ret) ? ret : TEMPLE_ORIGIN + ret;
    }
    return ret;
  }, [message]);

  if (!thumbnail) return null;

  return (
    <>
      <img
        src={thumbnail}
        className={clsx('cursor-pointer object-contain', className)}
        tabIndex={-1}
        onClick={() => setIsExpand(p => !p)}
      />
      <Modal
        open={isExpand}
        onCancel={() => setIsExpand(false)}
        destroyOnClose
        closable
        footer={false}
        centered
        width={960}
        className="[&_.ant-modal-content]:!p-0"
        closeIcon={
          <Icon name={bxX} className="rounded-full bg-white/50 text-black/60" />
        }
      >
        <img src={thumbnail} className="size-full object-contain" />
      </Modal>
    </>
  );
}
