import OneSignal from 'react-onesignal';
import { isDebugMode, isLocal, isProduction } from 'utils/version';

let initPromise: null | Promise<boolean> = null;
let oneSignalUser: null | string = null;

const init = () => {
  if (initPromise === null) {
    const appId = isLocal
      ? 'c25e5c04-1116-4441-8f7e-3f668df1b586'
      : isProduction
      ? 'b36841de-ac38-4574-837e-c24c7955765a'
      : '6c1b64e8-1efd-44f2-ae5a-36dbacc3e71d';
    initPromise = OneSignal.init({
      appId,
      notifyButton: {
        enable: false,
      },
      welcomeNotification: {
        disable: true,
      },
      autoResubscribe: true,
      autoRegister: false,
      allowLocalhostAsSecureOrigin: isLocal,
    }).then(() => {
      if (isDebugMode) console.log(`One Signal: Initiated (${appId})!`);
      return true;
    });
  }
  return initPromise;
};

const getUser = () => oneSignalUser;

const login = async (email: string) => {
  await init();
  if (oneSignalUser === email) {
    return true;
  }
  OneSignal.User.addAlias('external_id', email); // to fix android issue!
  await OneSignal.login(email);
  oneSignalUser = email;
  if (isDebugMode) console.log(`One Signal: Login Complete (${email})`);
  return true;
};

const logout = async () => {
  await init();
  if (oneSignalUser === null) {
    return true;
  }
  OneSignal.User.removeAlias('external_id');
  await OneSignal.logout();
  oneSignalUser = null;
  if (isDebugMode) console.log('One Signal: Logout');
  return true;
};

const hasPermission = () =>
  OneSignal.Notifications.isPushSupported() &&
  OneSignal.Notifications.permission;

const requestPermission = () =>
  OneSignal.Notifications.requestPermission().then(hasPermission);

export default {
  init,
  login,
  logout,
  getUser,
  hasPermission,
  requestPermission,
};
