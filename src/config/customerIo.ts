import { isProduction } from 'utils/version';

const cioId = isProduction ? 'e1fcf71a2b139e4c010e' : 'c6bccff0f61e66a6b755';

function getCio() {
  if (!(window as any)._cio) {
    const cio = ((window as any)._cio = []) as any;
    for (const eventName of [
      'load',
      'identify',
      'sidentify',
      'track',
      'page',
      'on',
      'off',
    ]) {
      cio[eventName] = (...rest: any[]) => cio.push([eventName, ...rest]);
    }
  }
  return (window as any)._cio;
}

let added = false;
function loadScript() {
  if (added) return;
  added = true;

  getCio();
  const t = document.createElement('script');
  t.async = true;
  t.id = 'cio-tracker';
  t.dataset.siteId = cioId;
  t.dataset.useArrayParams = 'true';
  t.dataset.useInApp = 'true';
  t.src = 'https://assets.customer.io/assets/track.js';
  document.head.append(t);
}

export default {
  loadScript,
  identify(email: string) {
    getCio().identify(email);
  },
};
