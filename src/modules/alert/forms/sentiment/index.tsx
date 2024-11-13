import { useTranslation } from 'react-i18next';
import { type AlertForm } from 'modules/alert/library/types';
import { ReactComponent as SentimentIcon } from './sentiment.svg';

export const useSentimentAlert = (): AlertForm => {
  const { t } = useTranslation('alerts');
  return {
    title: t('types.social_sentiment.title'),
    subtitle: t('types.social_sentiment.subtitle'),
    icon: SentimentIcon,
    value: 'sentiment',
    disabled: true,
  };
};
