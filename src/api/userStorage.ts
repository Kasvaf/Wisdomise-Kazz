import { useEffect, useState } from 'react';
import { ACCOUNT_PANEL_ORIGIN } from 'config/constants';
import { getJwtToken, useIsLoggedIn } from 'modules/base/auth/jwt-store';
import { ofetch } from 'config/ofetch';

const getIsLoggedIn = () => getJwtToken();

const getItem = (key: string, signal: AbortSignal) =>
  getIsLoggedIn()
    ? ofetch<{ value: string }>(
        `${ACCOUNT_PANEL_ORIGIN}/api/v1/account/user-storage/${key}`,
        {
          signal,
        },
      ).then(resp => (typeof resp.value === 'string' ? resp.value : null))
    : Promise.resolve(localStorage.getItem(`storage:${key}`));

const setItem = (key: string, value: string) =>
  getIsLoggedIn()
    ? ofetch(`${ACCOUNT_PANEL_ORIGIN}/api/v1/account/user-storage/${key}`, {
        body: {
          value,
        },
        method: 'post',
      })
    : Promise.resolve(localStorage.setItem(`storage:${key}`, value));

const removeItem = (key: string) =>
  getIsLoggedIn()
    ? ofetch(`${ACCOUNT_PANEL_ORIGIN}/api/v1/account/user-storage/${key}`, {
        method: 'delete',
      })
    : Promise.resolve(localStorage.removeItem(`storage:${key}`));

export function useUserStorage(key: string, defaultValue?: string) {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [value, setValue] = useState(defaultValue || null);
  const isLoggedIn = useIsLoggedIn();

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    setIsError(false);
    setValue(defaultValue ?? null);
    void getItem(key, controller.signal)
      .then(newValue => {
        setValue(newValue);
        setIsError(false);
        return newValue;
      })
      .catch(error => {
        if (error instanceof Error && error.name !== 'AbortError') {
          setIsError(true);
        }
      })
      .finally(() => setIsLoading(false));
    return () => {
      controller.abort();
    };
  }, [isLoggedIn, key, defaultValue]);

  const save = async (newValue: string) => {
    setValue(newValue);
    setIsLoading(true);
    try {
      await setItem(key, newValue);
    } catch {}
    setIsLoading(false);
  };

  const remove = async () => {
    setValue(null);
    setIsLoading(true);
    try {
      await removeItem(key);
    } catch {}
    setIsLoading(false);
  };

  return {
    isLoading,
    isError,
    value,
    save,
    remove,
  };
}
