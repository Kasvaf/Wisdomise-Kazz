import { useLocalStorage } from 'usehooks-ts';

const JWT_TOKEN_KEY = 'TOKEN';

export const getJwtToken = () => {
  return localStorage.getItem(JWT_TOKEN_KEY);
};

const useJwtToken = () => {
  return useLocalStorage(JWT_TOKEN_KEY, '', {
    deserializer: x => x,
  })[0];
};

export const useIsLoggedIn = () => {
  return !!useJwtToken();
};

export const setJwtToken = (token: string) => {
  localStorage.setItem(JWT_TOKEN_KEY, token);
};

export const delJwtToken = () => {
  localStorage.removeItem(JWT_TOKEN_KEY);
};
