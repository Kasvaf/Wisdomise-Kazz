import { clsx } from 'clsx';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Markdown from 'react-markdown';
import { type SocialMessage } from 'api';
import { Button } from 'shared/v1-components/Button';

export function SocialMessageContent({
  message,
  className,
  mode,
  onReadMore,
}: {
  message: SocialMessage;
  className?: string;
  mode: 'summary' | 'title' | 'full';
  onReadMore?: () => void;
}) {
  const { t } = useTranslation('coin-radar');

  const title = useMemo(() => {
    let ret: string | undefined;
    switch (message.social_type) {
      case 'reddit': {
        ret = message.content.title;
        break;
      }
      case 'trading_view': {
        ret = message.content.title;
        break;
      }
    }
    return ret;
  }, [message]);

  const preview = useMemo(() => {
    let ret: string | undefined;
    switch (message.social_type) {
      case 'reddit': {
        ret = message.content.text;
        break;
      }
      case 'telegram': {
        ret = message.content.message_text;
        break;
      }
      case 'twitter': {
        ret = message.content.text;
        break;
      }
      case 'trading_view': {
        ret = message.content.preview_text;
      }
    }
    return ret?.trim();
  }, [message]);

  const previewRef = useRef<HTMLDivElement>(null);
  const [hasOverflow, setHasOverflow] = useState(false);
  useEffect(() => {
    const el = previewRef.current;
    if (!el) return;
    setHasOverflow(
      el.clientWidth < el.scrollWidth || el.clientHeight < el.scrollHeight,
    );
  }, []);

  return (
    <div
      className={clsx(
        'relative flex w-full max-w-full flex-col gap-2',
        mode === 'summary' && 'overflow-hidden',
        className,
      )}
      ref={previewRef}
    >
      {/* Title */}
      {title && (
        <h3 className="text-sm font-normal text-v1-content-primary">{title}</h3>
      )}

      {/* Summary */}
      {preview && mode !== 'title' && (
        <Markdown className="!text-sm !font-light !text-v1-content-secondary [&_b]:text-v1-content-info">
          {preview}
        </Markdown>
      )}
      {mode === 'summary' && hasOverflow && (
        <div
          className={clsx(
            'absolute bottom-0 left-0 h-14 w-full bg-gradient-to-t from-v1-surface-l2 to-transparent',
          )}
        >
          <Button
            block
            variant="link"
            size="2xs"
            className={clsx('!absolute bottom-0 w-full')}
            onClick={onReadMore}
          >
            {t('social-messages.read_more')}
          </Button>
        </div>
      )}
    </div>
  );
}
