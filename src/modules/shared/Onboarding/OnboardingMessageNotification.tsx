import { useState } from 'react';
import { bxRightArrowAlt } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import YouTube from 'react-youtube';
import athenaIcon from 'assets/athena.mp4';
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
        'bottom-0 right-0 z-[2] rounded-xl p-6 pt-8 text-white',
        'mobile:fixed mobile:mx-4 mobile:mb-28 mobile:w-[calc(100%-2rem)]',
        'absolute mx-6 mb-24 w-[480px]',
        '2xl:mx-10 2xl:mb-10 2xl:w-[520px]',
        'onboarding-modal',
      )}
    >
      <CloseIcon
        onClick={() => {
          events.onIntract?.(
            currentSec === sections.length - 1
              ? 'gotit'
              : `close_in_step${currentSec + 1}`,
          );
          closeMessage();
        }}
        className="absolute right-4 top-4 cursor-pointer"
      />

      <section>
        <div className="flex items-center gap-2 font-semibold ">
          <video
            muted
            loop
            autoPlay
            playsInline
            style={{ clipPath: 'circle(48% at 50% 50%)' }}
            className="size-10 overflow-hidden object-cover"
          >
            <source src={athenaIcon} />
          </video>
          <p>{message.title}</p>
        </div>

        <div
          className={clsx(
            'mt-5 text-xs text-white/60',
            '[&_iframe]:mt-5 [&_iframe]:w-full [&_iframe]:rounded',
            '[&_ol]:ml-3 [&_ol]:list-decimal [&_ol_li::marker]:font-bold [&_ol_li::marker]:text-white/80 [&_ol_li]:pb-1',
            '[&_h1]:inline-block [&_h1]:pr-1 [&_h1]:font-bold [&_h1]:text-white/80',
            '[&_button]:rounded [&_button]:bg-white/10 [&_button]:px-3 [&_button]:py-1 [&_button]:text-sm [&_button]:font-medium [&_button]:text-white',
          )}
        >
          {message.content}

          {message.video && (
            <div className="aspect-video w-full">
              <YouTube
                className="h-full w-full"
                opts={{ width: '100%', height: '100%' }}
                videoId={message.video}
              />
            </div>
          )}
        </div>

        <section className="mt-6 flex items-center justify-between">
          <p className="text-xs text-white/70">
            {currentSec + 1} / {sections.length}
          </p>

          <div className="flex h-10 gap-3 text-sm">
            <button
              className={clsx(
                'p-2 text-white/70',
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
                'flex items-center gap-1 p-2',
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
                'hidden items-center gap-1 rounded bg-white/10 p-2',
                currentSec === sections.length - 1 && '!flex',
              )}
            >
              {t('onboarding.got-it')}
            </button>
          </div>
        </section>
      </section>
    </div>
  );
}
