/**
 * IMPORTANT: this file is now in process of migrating to `./src/api/horosApi.ts`
 * Add all api related code to the new file.
 */

import axios from 'axios';
import { NotificationManager } from 'react-notifications';
import DB from '../config/keys';

const TESTNET_ERROR = 'TestExchangeNotAvailable';

const genOptions = (userData) => ({
  headers: {
    Authenticaton: userData.jwtToken,
  },
});

//QUIZ START
// gets suggested risk value
export const checkRisk = (userData, duration, experience, risk) => {
  const post = {
    duration,
    activity: experience,
    risk: risk.toUpperCase(),
  };
  return axios.post(`${DB}/risk_proposition`, post, genOptions(userData));
};

// stores risk value adventurer/explorer/seeker
export const storeRisk = (userData, risk) => {
  const post = {
    risk,
  };
  return axios.post(`${DB}/set_risk`, post, genOptions(userData));
};

// saves exchange keys
export const saveKeys = (userData, exchange, key, secret) => {
  const post = {
    key,
    secret,
    exchange,
  };
  return axios.post(`${DB}/save_keys`, post, genOptions(userData));
};
//QUIZ END

export const showError = (err) => {
  const error = err.response && err.response.data && err.response.data.error;
  const testNetError = error === TESTNET_ERROR;
  NotificationManager.error(
    testNetError ? 'Binance Test Network is not available' : err.message,
  );
};
