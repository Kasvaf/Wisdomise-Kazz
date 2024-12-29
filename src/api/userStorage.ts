import { useEffect, useState } from 'react';
import { ACCOUNT_PANEL_ORIGIN } from 'config/constants';
import { useIsLoggedIn } from 'modules/base/auth/jwt-store';
import { ofetch } from 'config/ofetch';

const getItem = (key: string, storage: 'api' | 'local', signal: AbortSignal) =>
  storage === 'api'
    ? ofetch<{ value: string }>(
        `${ACCOUNT_PANEL_ORIGIN}/api/v1/account/user-storage/${key}`,
        {
          signal,
        },
      ).then(resp => (typeof resp.value === 'string' ? resp.value : null))
    : Promise.resolve(localStorage.getItem(`storage:${key}`));

const setItem = (key: string, value: string, storage: 'api' | 'local') =>
  storage === 'api'
    ? ofetch(`${ACCOUNT_PANEL_ORIGIN}/api/v1/account/user-storage/${key}`, {
        body: {
          value,
        },
        method: 'post',
      })
    : Promise.resolve(localStorage.setItem(`storage:${key}`, value));

const removeItem = (key: string, storage: 'api' | 'local') =>
  storage === 'api'
    ? ofetch(`${ACCOUNT_PANEL_ORIGIN}/api/v1/account/user-storage/${key}`, {
        method: 'delete',
      })
    : Promise.resolve(localStorage.removeItem(`storage:${key}`));

export function useUserStorage(key: string, defaultValue?: string) {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [value, setValue] = useState(defaultValue || null);
  const isLoggedIn = useIsLoggedIn();

  const storage = isLoggedIn ? 'api' : 'local';

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    setIsError(false);
    setValue(defaultValue ?? null);
    void getItem(key, storage, controller.signal)
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
  }, [storage, key, defaultValue]);

  const save = async (newValue: string) => {
    setValue(newValue);
    setIsLoading(true);
    try {
      await setItem(key, newValue, storage);
    } catch {}
    setIsLoading(false);
  };

  const remove = async () => {
    setValue(null);
    setIsLoading(true);
    try {
      await removeItem(key, storage);
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
