import { clsx } from 'clsx';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { bxRightArrowAlt, bxsCog } from 'boxicons-quasar';
import { type FinancialProduct } from 'api/types/financialProduct';
import { trackClick } from 'config/segment';
import CoinsIcons from 'shared/CoinsIcons';
import Badge from 'shared/Badge';
import Icon from 'shared/Icon';
import { ProfilePhoto } from 'modules/account/PageProfile/ProfilePhoto';
import { truncateUserId } from 'modules/account/PageProfile/truncateUserId';
import useIsFPRunning from '../useIsFPRunning';
import ProductInfoLines from '../ProductInfoLines';

const ProductCard: React.FC<{ fp: FinancialProduct }> = ({ fp }) => {
  const { t } = useTranslation('products');
  const isRunning = useIsFPRunning(fp.key);
  const market = (
    fp?.config.market_type || fp?.market_names?.[0]
  )?.toUpperCase();

  const { pathname } = useLocation();
  const userPageLink = `/users/${fp.owner.key}`;
  const isUserPage = pathname === userPageLink;

  return (
    <div
      className={clsx(
        'flex flex-col justify-between overflow-hidden rounded-2xl bg-[#1A1B1F] !text-white',
        'cursor-pointer transition-all hover:contrast-[1.1] hover:saturate-200',
      )}
    >
      <NavLink
        to={userPageLink}
        className={clsx(
          'group flex h-12 items-center justify-center gap-1 bg-black/10 py-3',
          !isUserPage && 'hover:bg-black/40 hover:text-white',
        )}
      >
        <ProfilePhoto
          className="size-6 shrink-0 rounded-full"
          type="avatar"
          src={fp.owner?.cprofile.profile_image}
        />
        <span className="ml-1 text-xs">
          {fp.owner?.cprofile.nickname || truncateUserId(fp.owner.key)}
        </span>
        {!isUserPage && (
          <Icon
            className="transition-all group-hover:ml-1"
            name={bxRightArrowAlt}
            size={16}
          />
        )}
      </NavLink>

      <Link
        to={`/investment/products-catalog/fp/${fp.key}`}
        onClick={trackClick('ai_driven_strategies_list', {
          strategy_name: fp.title,
        })}
        className={clsx(
          'group flex flex-col justify-between gap-6 !text-white',
        )}
      >
        <div className="px-3">
          <div className="flex h-[52px] items-center justify-between gap-1">
            <div>
              <h2 className="line-clamp-1 text-base font-semibold">
                {fp.title}
              </h2>
              <p className="line-clamp-3 text-xs font-light text-white/50">
                {fp.description}
              </p>
            </div>

            <CoinsIcons maxShow={2} coins={fp.config.assets} />
          </div>
          <div className="border-b border-white/5 py-2" />
          <div className="mb-3 flex items-center gap-1 pt-3">
            {fp.config.subscription_level ? (
              <Badge color="purple" label={t('common:paid-plan')} />
            ) : (
              <Badge color="green" label={t('common:free-plan')} />
            )}

            {Boolean(market) &&
              (market === 'FUTURES' ? (
                <Badge color="orange" label={t('common:futures')} />
              ) : (
                <Badge color="blue" label={t('common:spot')} />
              ))}
          </div>
        </div>

        <div className="px-3">
          <ProductInfoLines fp={fp} />
        </div>

        <div
          className={clsx(
            'flex h-12 items-center justify-center',
            'bg-gradient-to-r from-[#09090A]/30 to-[#2314364D]/30',
          )}
        >
          {isRunning ? (
            <>
              <Icon name={bxsCog} size={20} className="mr-2 animate-spin" />
              {t('product-catalog.state-running')}
              <Icon
                className="transition-all group-hover:ml-1"
                name={bxRightArrowAlt}
              />
            </>
          ) : (
            <>
              {t('common:actions.explore')}
              <Icon
                className="transition-all group-hover:ml-1"
                name={bxRightArrowAlt}
              />
            </>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
