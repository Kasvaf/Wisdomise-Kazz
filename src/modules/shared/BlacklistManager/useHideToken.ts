import { useUserSettings } from 'modules/base/auth/UserSettingsProvider';
import { useMemo } from 'react';

export const useHideToken = ({
  address,
  devAddress,
  network,
}: {
  devAddress?: string | null;
  address?: string | null;
  network?: 'solana';
}) => {
  const { settings } = useUserSettings();

  const isHiddenByDev = useMemo(() => {
    return settings.blacklists.some(
      i => i.network === network && i.type === 'dev' && i.value === devAddress,
    );
  }, [network, settings.blacklists, devAddress]);

  const isHiddenByCA = useMemo(() => {
    return settings.blacklists.some(
      i => i.network === network && i.type === 'ca' && i.value === address,
    );
  }, [address, network, settings.blacklists]);

  return {
    isHidden: isHiddenByDev || isHiddenByCA,
    isHiddenByCA,
    isHiddenByDev,
  };
};
