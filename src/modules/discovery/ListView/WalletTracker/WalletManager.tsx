import { Collapse } from 'antd';
import {
  type Library,
  type LibraryWallet,
  useLibrariesQuery,
} from 'api/library';
import { bxTrash } from 'boxicons-quasar';
import { useUserSettings } from 'modules/base/auth/UserSettingsProvider';
import { useMemo } from 'react';
import Icon from 'shared/Icon';
import { Button } from 'shared/v1-components/Button';
import { Table } from 'shared/v1-components/Table';
import { shortenAddress } from 'utils/shortenAddress';

const useSelectedLibs = () => {
  const { settings } = useUserSettings();
  const { data: libs } = useLibrariesQuery();

  return useMemo(() => {
    return settings.wallet_tracker.selected_libraries
      .map(({ key }) => libs?.results.find(l => l.key === key))
      .filter(Boolean) as Library[];
  }, [settings.wallet_tracker.selected_libraries, libs]);
};

export default function WalletManager({ className }: { className?: string }) {
  const selectedLibs = useSelectedLibs();
  const { settings } = useUserSettings();

  return (
    <div className={className}>
      <Collapse
        items={[
          {
            key: '1',
            label: 'Wallet Manager',
            children: (
              <div>
                <Collapse
                  items={[
                    {
                      key: 'manual',
                      label: 'Manual List',
                      children: (
                        <WalletGroup
                          hasActions={true}
                          wallets={settings.wallet_tracker.imported_wallets}
                        />
                      ),
                    },
                    ...selectedLibs.map(lib => ({
                      key: lib.key,
                      label: `${lib.name} (${lib.wallets.length} Wallets)`,
                      children: <WalletGroup wallets={lib.wallets} />,
                    })),
                  ]}
                  size="small"
                />
              </div>
            ),
          },
        ]}
        size="small"
      />
    </div>
  );
}

function WalletGroup({
  wallets,
  hasActions,
}: {
  wallets: LibraryWallet[];
  hasActions?: boolean;
}) {
  const { deleteImportedWallet, deleteAllImportedWallets } = useUserSettings();
  return (
    <div>
      <Table
        columns={[
          {
            key: 'name',
            title: 'Name',
            render: row => (
              <div className="flex items-center gap-1">
                <div className="text-lg">{row.emoji}</div>
                <div>
                  <div className="text-xs">{row.name}</div>
                  <div className="text-v1-content-secondary text-xxs">
                    {shortenAddress(row.address)}
                  </div>
                </div>
              </div>
            ),
          },
          {
            key: 'actions',
            align: 'end',
            title: hasActions && (
              <div className="flex w-full justify-end">
                <Button
                  className="!text-v1-content-negative"
                  onClick={deleteAllImportedWallets}
                  size="3xs"
                  variant="ghost"
                >
                  Remove All
                </Button>
              </div>
            ),
            render: row =>
              hasActions ? (
                <div>
                  <Button
                    className="text-white/70"
                    fab
                    onClick={() => deleteImportedWallet(row.address)}
                    size="xs"
                    variant="ghost"
                  >
                    <Icon name={bxTrash} />
                  </Button>
                </div>
              ) : (
                ''
              ),
          },
        ]}
        dataSource={wallets}
        surface={1}
      />
    </div>
  );
}
