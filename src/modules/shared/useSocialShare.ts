import { useTelegram } from 'modules/base/mini-app/TelegramProvider';
import { isMiniApp } from 'utils/version';

export const useSocialShare = () => {
  const { webApp } = useTelegram();

  const shareOnTwitter = (text: string, url = '', hashtags: string[] = []) => {
    const stringifyHashtags = hashtags.join(',');
    const shareLink = `https://x.com/intent/tweet?text=${text}&url=${url}&hashtags=${stringifyHashtags}`;
    window.open(shareLink, '_blank');
  };

  const shareOnTelegram = (text: string, url = '') => {
    const shareLink = `https://t.me/share/url?text=${text}&url=${url}`;
    isMiniApp
      ? webApp?.openTelegramLink(shareLink)
      : window.open(shareLink, '_blank');
  };

  const shareOnLinkedin = (url: string) => {
    const shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    window.open(shareLink, '_blank');
  };

  return {
    shareOnTwitter,
    shareOnTelegram,
    shareOnLinkedin,
  };
};
