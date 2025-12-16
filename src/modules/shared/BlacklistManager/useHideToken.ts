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

  const isHidden = useMemo(() => {
    return settings.blacklists.some(
      i =>
        i.network === network &&
        ((i.type === 'ca' && i.value === address) ||
          (i.type === 'dev' && i.value === devAddress)),
    );
  }, [address, network, settings.blacklists, devAddress]);

  return { isHidden };
};
