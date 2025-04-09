import { isLocal, isProduction } from 'utils/version';

let added = false;

export default function configCookieBot() {
  if (added || isLocal) {
    return;
  }

  added = true;

  // to put cookie-bot banner behind login modal
  window.addEventListener('UC_UI_VIEW_CHANGED', () => {
    setTimeout(() => {
      const host = document.querySelector('#usercentrics-cmp-ui');
      if (host) {
        const shadow = host.shadowRoot;
        if (shadow) {
          const cmpWrapper = shadow.querySelector('.cmp-wrapper');
          if (cmpWrapper instanceof HTMLElement) {
            cmpWrapper.style.zIndex = '100';
          }
        }
      }
    }, 50);
  });

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
