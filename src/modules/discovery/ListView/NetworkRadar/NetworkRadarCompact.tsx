/* eslint-disable import/max-dependencies */
import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { AccessShield } from 'shared/AccessShield';
import { Table } from 'shared/v1-components/Table';
import { type NetworkRadarNCoin } from 'api/discovery';
import { useDiscoveryRouteMeta } from 'modules/discovery/useDiscoveryRouteMeta';
import { useCoinPreDetailModal } from '../CoinPreDetailModal';
import { NCoinPreDetailModal } from './NCoinPreDetailModal';

export const NetworkRadarCompact: FC<{ focus?: boolean }> = ({ focus }) => {
  const { t } = useTranslation('network-radar');

  const [openModal, { closeModal, isModalOpen, selectedRow }] =
    useCoinPreDetailModal<NetworkRadarNCoin>({
      directNavigate: !focus,
      slug: r => r.base_symbol.slug,
    });

  const {
    params: { slug: activeSlug },
  } = useDiscoveryRouteMeta();
  return (
    <>
      {focus && (
        <div className="mb-2 flex items-center justify-between">
          <h1 className="text-sm">{t('page.title')}</h1>
        </div>
      )}
      <AccessShield
        mode="table"
        sizes={{
          guest: false,
          initial: false,
          free: false,
          vip: false,
        }}
      >
        <Table
          columns={[]}
          dataSource={[]}
          // rowKey={r => r.base_contract_address}
          loading={true}
          surface={2}
          scrollable={false}
          onClick={r => openModal(r)}
          isActive={r => r === activeSlug}
        />
      </AccessShield>
      <NCoinPreDetailModal
        value={selectedRow}
        open={isModalOpen}
        onClose={() => closeModal()}
      />
    </>
  );
};
