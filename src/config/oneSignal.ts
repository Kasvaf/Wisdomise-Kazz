import OneSignal from 'react-onesignal';
import { isDebugMode, isLocal, isProduction } from 'utils/version';

let initPromise: null | Promise<void> = null;

const init = async () => {
  const appId = isLocal
    ? 'c25e5c04-1116-4441-8f7e-3f668df1b586'
    : isProduction
    ? 'b36841de-ac38-4574-837e-c24c7955765a'
    : '6c1b64e8-1efd-44f2-ae5a-36dbacc3e71d';
  if (initPromise === null) {
    initPromise = OneSignal.init({
      appId,
      notifyButton: {
        enable: false,
      },
      welcomeNotification: {
        disable: true,
      },
      serviceWorkerPath: '/sw.js',
      serviceWorkerUpdaterPath: '/sw.js',
      serviceWorkerParam: {
        scope: '/',
      },
      allowLocalhostAsSecureOrigin: isLocal,
      autoResubscribe: true,
      autoRegister: false,
    });
    await initPromise;
    if (isDebugMode) console.log(`One Signal: Initiated (${appId})!`);
    return true;
  }
  return await initPromise;
};

const setExternalId = async (email?: string) => {
  await init();
  if (email) {
    await OneSignal.login(email);
    // OneSignal.User.addAlias('external_id', email);
    if (isDebugMode) console.log(`One Signal: Login (${email})`);
  } else {
    // OneSignal.User.removeAlias('external_id');
    await OneSignal.logout();
    if (isDebugMode) console.log('One Signal: Logout');
  }
};

const getPushStatus = () => {
  let returnValue:
    | 'ok'
    | 'not-supported'
    | 'no-permission-granted'
    | 'not-opted-in' = 'ok';
  if (!OneSignal.Notifications.isPushSupported()) returnValue = 'not-supported';
  else if (!OneSignal.Notifications.permission)
    returnValue = 'no-permission-granted';
  else if (!OneSignal.User.PushSubscription.optedIn)
    returnValue = 'not-opted-in';
  if (isDebugMode) console.log(`One Signal: Push Status is "${returnValue}"`);
  return returnValue;
};

const requestPush = async () => {
  const currentStatus = getPushStatus();
  if (currentStatus === 'not-supported') {
    alert('Your browser does not support push notifications.');
    return currentStatus;
  }
  if (currentStatus === 'ok') {
    return currentStatus;
  }
  await OneSignal.Notifications.requestPermission();
  await OneSignal.User.PushSubscription.optIn();
  return getPushStatus();
};

export default {
  init,
  setExternalId,
  requestPush,
  getPushStatus,
};
