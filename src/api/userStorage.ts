import { useEffect, useState } from 'react';
import { ACCOUNT_PANEL_ORIGIN } from 'config/constants';
import { getJwtToken } from 'modules/base/auth/jwt-store';
import { ofetch } from 'config/ofetch';
import { useAccountQuery } from './account';

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

export function useUserStorage(key: string) {
  const { data: account } = useAccountQuery();
  const userEmail = account?.info?.email ?? '';
  const [isLoading, setIsLoading] = useState(true);
  const [value, setValue] = useState<null | string>(null);
  const [owner, setOwner] = useState<null | string>(null);

  useEffect(() => {
    setOwner(null);
  }, [userEmail]);

  useEffect(() => {
    const controller = new AbortController();
    if (userEmail) {
      setIsLoading(true);
      setValue(null);
      void getItem(key, controller.signal)
        .then(newValue => {
          setValue(newValue);
          setOwner(userEmail);
          return newValue;
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
      setValue(null);
      setOwner(null);
    }
    return () => {
      try {
        controller.abort();
      } catch {}
    };
  }, [userEmail, key]);

  const save = async (newValue: string) => {
    setIsLoading(true);
    try {
      await setItem(key, newValue);
      setValue(newValue);
    } catch {}
    setIsLoading(false);
  };

  const remove = async () => {
    setIsLoading(true);
    try {
      await removeItem(key);
      setValue(null);
    } catch {}
    setIsLoading(false);
  };

  return {
    isTrusted: owner === userEmail && !isLoading,
    isLoading,
    value,
    save,
    remove,
  };
}
