import { Trans, useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import './styles.css';
import { useAthenaFloat } from 'modules/base/Container/AthenaFloat/AthenaFloatProvider';
import { useAthena } from '../core';
import closeIcon from './images/closeAthena.svg';

export default function Header({ isFloat }: { isFloat?: boolean }) {
  const { question } = useAthena();
  const floatCtx = useAthenaFloat();
  const { t } = useTranslation('athena');

  return (
    <section
      className={clsx('mt-4 text-center mobile:mt-10', question && 'invisible')}
    >
      <div
        className={clsx('absolute right-6 top-5 z-10', !isFloat && 'hidden')}
      >
        <img
          src={closeIcon}
          className="w-10 cursor-pointer"
          onClick={floatCtx?.toggleOpen}
        />
      </div>

      <p
        className={clsx(
          'text-2xl font-light tracking-[-1.4px] text-white/80 mobile:text-xl',
          isFloat && 'invisible mobile:hidden',
        )}
      >
        {t('heading.title')}
      </p>
      <p className="mt-6 text-5xl font-bold !leading-[137%] tracking-[-2.8px] text-white/90 mobile:text-3xl mobile:!leading-[200%] mobile:tracking-[-1.8px]">
        <Trans i18nKey="heading.second-title" ns="athena">
          Navigating Crypto with AI <br /> Chat
        </Trans>{' '}
        <span className="text-wsdm-gradient">
          {t('heading.second-title-word1')}
        </span>
      </p>
    </section>
  );
}
