import { isLocal, isProduction } from 'utils/version';

const cioId = isProduction ? 'e1fcf71a2b139e4c010e' : 'c6bccff0f61e66a6b755';

let added = false;
export default function configCustomerIo(email?: string) {
  if (isLocal) return;

  const cio = ((window as any)._cio = (window as any)._cio || []);
  if (added) {
    if (email) cio.identify({ id: email, email });
    return;
  }

  // ----------------------- dynamic add script tag -----------------------
  added = true;
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
  if (email) cio.identify({ id: email, email });

  const t = document.createElement('script');
  t.async = true;
  t.id = 'cio-tracker';
  t.dataset.siteId = cioId;
  t.dataset.useArrayParams = 'true';
  t.dataset.useInApp = 'true';
  t.src = 'https://assets.customer.io/assets/track.js';
  document.head.append(t);
}
