import { useState } from 'react';
import { bxRightArrowAlt } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import YouTube from 'react-youtube';
import Icon from 'shared/Icon';
import { ReactComponent as CloseIcon } from './icons/close.svg';
import { useOnboardingMessage } from './utils';

export default function OnboardingMessageNotification() {
  const { t } = useTranslation('base');
  const [currentSec, setCurrentSec] = useState(0);
  const { sections, isOpen, closeMessage, events } = useOnboardingMessage();
  const message = sections?.[currentSec];

  if (!message || !isOpen) {
    return null;
  }

  return (
    <div
      className={clsx(
        'flex flex-col gap-5',
        'bottom-0 right-0 z-[5] rounded-xl bg-v1-surface-l4 p-6 text-v1-content-primary',
        'mobile:fixed mobile:mx-4 mobile:mb-20 mobile:w-[calc(100%-2rem)]',
        'absolute mx-6 mb-24 w-[480px]',
        '2xl:mx-10 2xl:mb-24 2xl:w-[533px]',
      )}
    >
      <section className="flex flex-nowrap items-start justify-between gap-2">
        <div className="max-w-md pt-1 text-base font-semibold">
          {message.title}
        </div>
        <CloseIcon
          onClick={() => {
            events.onIntract?.(
              currentSec === sections.length - 1
                ? 'gotit'
                : `close_in_step${currentSec + 1}`,
            );
            closeMessage();
          }}
          className="shrink-0 cursor-pointer"
        />
      </section>

      <section
        className={clsx(
          'text-xs font-normal leading-normal text-v1-content-secondary',
        )}
      >
        {message.content}
      </section>

      {message.video && (
        <div className="aspect-video w-full overflow-hidden rounded-lg">
          <YouTube
            className="h-full w-full"
            opts={{ width: '100%', height: '100%' }}
            videoId={message.video}
          />
        </div>
      )}

      <section className="flex items-center justify-between">
        <p className="text-xs text-v1-content-secondary">
          {currentSec + 1} / {sections.length}
        </p>

        <div className="flex h-10 gap-3 text-sm">
          <button
            className={clsx(
              'p-2 text-v1-content-secondary',
              currentSec === 0 && 'invisible',
            )}
            onClick={() => {
              events.onIntract?.(`back_in_step${currentSec + 1}`);
              setCurrentSec(pre => --pre);
            }}
          >
            {t('onboarding.back')}
          </button>
          <button
            className={clsx(
              'flex cursor-pointer items-center gap-1 p-2 uppercase',
              currentSec === sections.length - 1 && 'hidden',
            )}
            onClick={() => {
              events.onIntract?.(`next_in_step${currentSec + 1}`);
              setCurrentSec(pre => ++pre);
            }}
          >
            {t('onboarding.next')} <Icon name={bxRightArrowAlt} />
          </button>

          <button
            onClick={() => {
              events.onIntract?.('gotit');
              closeMessage();
            }}
            className={clsx(
              'hidden cursor-pointer items-center gap-1 p-2 uppercase',
              currentSec === sections.length - 1 && '!flex',
            )}
          >
            {t('onboarding.got-it')}
          </button>
        </div>
      </section>
    </div>
  );
}
