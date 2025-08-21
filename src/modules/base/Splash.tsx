import { ReactComponent as Logo } from 'assets/monogram-green.svg';
import { useEmbedView } from 'modules/embedded/useEmbedView';
import { useTranslation } from 'react-i18next';

const Splash = () => {
  const { t } = useTranslation();
  const { isEmbeddedView } = useEmbedView();
  if (isEmbeddedView) return null;

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <Logo className="mb-[50px] h-[200px] w-full" />
      <div className="loader-line" />
      <p className="mt-[14px] font-medium text-[16px] text-white">
        {t('base:wisdomise-is-loading')}
      </p>
    </div>
  );
};

export default Splash;
