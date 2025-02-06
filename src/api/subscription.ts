import { useNavigate } from 'react-router-dom';
import { isMiniApp } from 'utils/version';
import { useEmbedView } from 'modules/embedded/useEmbedView';
import { APP_PANEL } from 'config/constants';
import { useIsLoggedIn } from 'modules/base/auth/jwt-store';
import { useModalLogin } from 'modules/base/auth/ModalLogin';
import { useAccountQuery } from './account';

export type UserGroup = 'guest' | 'trial' | 'free' | 'pro' | 'pro+' | 'pro_max';

export function useSubscription() {
  const { data: account, isLoading, refetch } = useAccountQuery();
  const subs = account?.subscription_item;
  const plan = subs?.subscription_plan;
  const title = plan?.name || 'none';
  const { isEmbeddedView } = useEmbedView();
  const isLoggedIn = useIsLoggedIn();

  const navigate = useNavigate();
  const [loginModal, showModalLogin] = useModalLogin();

  const level = isMiniApp ? 3 : plan?.level ?? 0;

  const status = subs?.status ?? 'active';

  const group: UserGroup = isLoggedIn
    ? isMiniApp
      ? 'pro_max'
      : status === 'trialing'
      ? 'trial'
      : level === 0
      ? 'free'
      : level === 1
      ? 'pro'
      : level === 2
      ? 'pro+'
      : 'pro_max'
    : 'guest';

  const ensureGroup = async (neededGroup: UserGroup | UserGroup[]) =>
    await new Promise<boolean>((resolve, reject) => {
      if (isEmbeddedView) {
        if (top) {
          top.window.location.href = `${APP_PANEL}/account/billing`;
          // never resolve
        } else {
          reject(new Error('Cannot access to "top" object!'));
        }
      } else {
        const neededGroups = Array.isArray(neededGroup)
          ? neededGroup
          : [neededGroup];

        if (neededGroups.includes(group)) {
          resolve(true);
        } else if (group === 'guest') {
          return showModalLogin();
        } else {
          navigate('/account/billing');
          // never resolve
        }
      }
    });

  return {
    plan,
    refetch,
    isLoading,
    title,
    level,
    status,
    currentPeriodEnd: subs?.end_at && new Date(subs.end_at),
    remaining:
      level === 0
        ? 0
        : Math.max(Math.round(+new Date(subs?.end_at ?? 0) - Date.now()), 0),
    group,
    ensureGroup,
    loginModal,
  };
}
