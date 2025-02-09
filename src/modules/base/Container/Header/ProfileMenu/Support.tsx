import { useTranslation } from 'react-i18next';
import { openHubSpot } from 'config/hubSpot';
import { ReactComponent as QuestionRectIcon } from './question-rect.svg';

const Support = () => {
  const { t } = useTranslation('base');
  return (
    <button
      className="flex w-full items-center justify-center"
      onClick={openHubSpot}
    >
      <QuestionRectIcon />
      <span className="ml-3 mr-2">{t('support.title')}</span>
      <span className="text-xs font-normal text-white/40">
        {t('support.hint')}
      </span>
    </button>
  );
};

export default Support;
