import { isProduction } from 'utils/version';

let added = false;

export default function configCookieBot() {
  if (added || !isProduction) {
    return;
  }

  added = true;
  const script = document.createElement('script');
  script.id = 'Cookiebot';
  script.async = true;
  script.type = 'text/javascript';
  script.dataset.cbid = '45ba2d94-5ef7-46ad-bb13-2894c89025f9';
  script.src = 'https://consent.cookiebot.com/uc.js';
  document.head.append(script);
}
