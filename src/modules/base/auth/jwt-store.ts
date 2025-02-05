import { useEffect, useMemo, useState } from 'react';

const JWT_TOKEN_KEY = 'TOKEN';

export const getJwtToken = () => {
  return localStorage.getItem(JWT_TOKEN_KEY);
};

const handlers: Array<() => void> = [];
const callHandlers = () => {
  setTimeout(() => {
    for (const handler of handlers) {
      handler();
    }
  }, 0);
};

const useJwtToken = () => {
  const [jwt, setJwt] = useState(localStorage.getItem(JWT_TOKEN_KEY));
  useEffect(() => {
    const handler = () => setJwt(localStorage.getItem(JWT_TOKEN_KEY));
    window.addEventListener('storage', handler);
    handlers.push(handler);
    return () => {
      window.removeEventListener('storage', handler);
      handlers.splice(handlers.indexOf(handler), 1);
    };
  }, []);
  return jwt;
};

export const useJwtEmail = () => {
  const jwt = useJwtToken();
  return useMemo(
    () =>
      JSON.parse(atob((jwt || '').split('.')?.[1] ?? '') || '{}')?.email || '',
    [jwt],
  );
};

export const useIsLoggedIn = () => {
  return !!useJwtToken();
};

export const setJwtToken = (token: string) => {
  localStorage.setItem(JWT_TOKEN_KEY, token);
  callHandlers();
};

export const delJwtToken = () => {
  localStorage.removeItem(JWT_TOKEN_KEY);
  callHandlers();
};
