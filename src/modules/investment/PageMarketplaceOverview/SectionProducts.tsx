import { clsx } from 'clsx';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { bxRightArrowAlt } from 'boxicons-quasar';
import { useFinancialProductsQuery } from 'api';
import useIsMobile from 'utils/useIsMobile';
import Icon from 'shared/Icon';
import Spinner from 'shared/Spinner';
import CarouselItems from 'shared/CarouselItems';
import { ButtonSelect } from 'shared/ButtonSelect';
import ProductListItem from './ProductListItem';

const SectionProducts: React.FC<{ className?: string }> = ({ className }) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const [fpType, setFpType] = useState<'ALL' | 'MINE'>('ALL');

  const fps = useFinancialProductsQuery({ type: fpType });
  const activeFps = fps.data?.products?.filter(
    fp => fp.is_active && fp.config.assets.length > 0,
  );

  const content =
    fps.isLoading || !activeFps ? (
      <div className="flex justify-center">
        <Spinner />
      </div>
    ) : (
      <div className="desktop:overflow-y-auto flex max-h-[360px] flex-col gap-4">
        {isMobile ? (
          <CarouselItems
            Component={ProductListItem}
            items={activeFps.map(x => ({ key: x.key, product: x }))}
          />
        ) : (
          activeFps.map(fp => <ProductListItem key={fp.key} product={fp} />)
        )}
      </div>
    );

  return (
    <div className={clsx('rounded-2xl bg-v1-surface-l2 p-6', className)}>
      <div className="mb-8 flex items-center justify-between">
        <div>{t('base:menu.financial-products.title')}</div>

        <NavLink
          to="/marketplace/products-catalog"
          className="flex items-center text-xs text-v1-content-link hover:text-v1-content-link-hover"
        >
          {t('common:see-more')}
          <Icon name={bxRightArrowAlt} size={16} />
        </NavLink>
      </div>

      <div>
        <ButtonSelect
          options={[
            { value: 'ALL', label: 'All Products' },
            { value: 'MINE', label: 'My Products' },
          ]}
          value={fpType}
          onChange={setFpType}
          className="mb-8"
        />
        {content}
      </div>
    </div>
  );
};

export default SectionProducts;
