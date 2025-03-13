import { useTranslation } from 'react-i18next';
import { ReactComponent as Logo } from 'assets/logo-vertical.svg';
import { useEmbedView } from 'modules/embedded/useEmbedView';

const Splash = () => {
  const { t } = useTranslation();
  const { isEmbeddedView } = useEmbedView();
  if (isEmbeddedView) return null;

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <Logo className="mb-[50px] h-[200px] w-full" />
      <div className="loader-line" />
      <p className="mt-[14px] text-[16px] font-medium text-white">
        {t('base:wisdomise-is-loading')}
      </p>
    </div>
  );
};

export default Splash;
