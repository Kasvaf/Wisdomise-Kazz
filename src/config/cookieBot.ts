import { isProduction } from 'utils/version';

let added = false;

export default function configCookieBot() {
  if (added) {
    return;
  }
  console.log('initializing cookieBot...');

  added = true;
  const autoBlockerScript = document.createElement('script');
  autoBlockerScript.src =
    'https://web.cmp.usercentrics.eu/modules/autoblocker.js';
  document.head.append(autoBlockerScript);

  const uiScript = document.createElement('script');
  uiScript.id = 'usercentrics-cmp';
  uiScript.async = true;
  uiScript.dataset.settingsId = 'CMM7wkkj5sixjl';
  uiScript.dataset.draft = isProduction ? 'false' : 'true';
  uiScript.src = 'https://web.cmp.usercentrics.eu/ui/loader.js';
  document.head.append(uiScript);
}
