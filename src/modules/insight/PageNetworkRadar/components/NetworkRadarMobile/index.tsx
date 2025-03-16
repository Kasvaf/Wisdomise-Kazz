/* eslint-disable import/max-dependencies */
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MobileSearchBar } from 'shared/MobileSearchBar';
import RadarsTabs from 'modules/insight/RadarsTabs';
import { useTableState } from 'shared/Table';
import { Coin } from 'shared/Coin';
import { AccessShield } from 'shared/AccessShield';
import { MobileTable, type MobileTableColumn } from 'shared/MobileTable';
import { CoinPreDetailModal } from 'modules/insight/CoinPreDetailModal';
import {
  type NetworkRadarPool,
  useNetworkRadarPools,
} from 'api/insight/network';
import { NetworkSelect } from 'shared/NetworkSelect';

export const NetworkRadarMobile = () => {
  const { t } = useTranslation();
  const [, tableState, setTableState] = useTableState<
    Required<Parameters<typeof useNetworkRadarPools>[0]>
  >('', {
    page: 1,
    pageSize: 10,
    networks: [],
  });

  const [selectedRow, setSelectedRow] = useState<null | NetworkRadarPool>(null);
  const [modal, setModal] = useState(false);

  const pools = useNetworkRadarPools(tableState);

  const columns = useMemo<Array<MobileTableColumn<NetworkRadarPool>>>(
    () => [
      {
        key: 'index',
        className: 'max-w-6 min-w-2 text-start text-xs font-medium',
        render: (_, index) => index + 1,
      },
      {
        key: 'coin',
        render: row => (
          <Coin
            coin={row.base_symbol}
            imageClassName="size-7"
            className="text-sm"
            truncate={70}
            nonLink={true}
          />
        ),
      },
    ],
    [],
  );

  return (
    <>
      <MobileSearchBar className="mb-4" />
      <RadarsTabs className="mb-4" />
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-sm">{t('base:menu.network-radar.title')}</h1>
        </div>
        <NetworkSelect
          value={tableState.networks?.[0]}
          allowClear
          multiple={false}
          onChange={newNetwork =>
            setTableState({ networks: newNetwork ? [newNetwork] : [] })
          }
          size="sm"
          valueType="slug"
          surface={2}
        />
      </div>
      <AccessShield
        mode="mobile_table"
        sizes={{
          'guest': true,
          'initial': 3,
          'free': 3,
          'pro': false,
          'pro+': false,
          'pro_max': false,
        }}
      >
        <MobileTable
          columns={columns}
          dataSource={pools.data ?? []}
          rowKey={r => JSON.stringify(r.base_symbol.slug)}
          loading={pools.isLoading}
          surface={2}
          onClick={r => {
            setSelectedRow(r);
            setModal(true);
          }}
        />
      </AccessShield>
      <CoinPreDetailModal
        coin={selectedRow?.base_symbol}
        open={modal}
        onClose={() => setModal(false)}
      >
        <div className="whitespace-pre font-mono text-xxs">
          {JSON.stringify(selectedRow, null, 2)}
        </div>
      </CoinPreDetailModal>
    </>
  );
};
