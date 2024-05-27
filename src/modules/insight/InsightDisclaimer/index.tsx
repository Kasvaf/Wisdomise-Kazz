import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { useLocalStorage } from 'usehooks-ts';
import { useLocation } from 'react-router-dom';
import { ReactComponent as CloseIcon } from 'shared/Onboarding/icons/close.svg';
import Button from 'shared/Button';
import { ReactComponent as WarnIcon } from './warn.svg';

function InsightDisclaimer() {
  const { t } = useTranslation('base');
  const { pathname } = useLocation();
  const [isClosed, setIsClosed] = useLocalStorage<string[]>(
    'insight-disclaimer',
    [],
  );
  const isOpen = !isClosed.includes(pathname);
  const closeMessage = () => {
    setIsClosed(x => [...x, pathname]);
  };

  return (
    <div
      className={clsx(
        'absolute right-6 top-0 z-[2] min-w-[500px] max-w-[550px] rounded-xl p-6 pt-8 text-white',
        'onboarding-modal mobile:hidden',
        !isOpen && 'hidden',
      )}
    >
      <CloseIcon
        onClick={closeMessage}
        className="absolute right-4 top-4 cursor-pointer"
      />

      <section>
        <div className="flex items-center gap-2 font-semibold ">
          <WarnIcon />
          <p>{t('insight-declaimer.title')}</p>
        </div>

        <div className={clsx('mt-5 text-xs text-white/60')}>
          {t('insight-declaimer.content')}
        </div>
      </section>

      <section className="mt-6 flex items-center justify-end">
        <Button variant="alternative" className="!rounded !p-2">
          {t('onboarding.got-it')}
        </Button>
        <button
          onClick={closeMessage}
          className={clsx('hidden items-center gap-1 rounded bg-white/10 p-2')}
        >
          {t('onboarding.got-it')}
        </button>
      </section>
    </div>
  );
}

export default InsightDisclaimer;
