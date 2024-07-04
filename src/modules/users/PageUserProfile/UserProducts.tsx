import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFinancialProductsQuery } from 'api';
import ProductCard from 'modules/investment/PageProductsCatalog/ProductCard';
import Spinner from 'shared/Spinner';

const UserProducts: React.FC<{ userId: string }> = ({ userId }) => {
  const { t } = useTranslation('products');
  const fps = useFinancialProductsQuery({ userId });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const activeFps = fps?.data?.products?.filter(
    fp => fp.is_active && fp.config.assets.length > 0,
  );

  if (fps.isLoading) {
    return (
      <div className="flex justify-center">
        <Spinner />
      </div>
    );
  }

  if (!activeFps?.length) {
    return (
      <p className="rounded-lg bg-black/10 p-4 py-10 text-center text-sm font-light text-white/70">
        {t('common:nothing-to-show')}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 mobile:justify-center lg:grid-cols-2 xl:grid-cols-4">
      {activeFps?.map(fp => <ProductCard key={fp.key} fp={fp} />)}
    </div>
  );
};

export default UserProducts;
