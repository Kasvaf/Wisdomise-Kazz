import { useNavigate } from 'react-router-dom';
import { isMiniApp } from 'utils/version';
import { useEmbedView } from 'modules/embedded/useEmbedView';
import { APP_PANEL } from 'config/constants';
import { useIsLoggedIn } from 'modules/base/auth/jwt-store';
import { useModalLogin } from 'modules/base/auth/ModalLogin';
import { useAccountQuery } from './account';

export type UserGroup =
  | 'guest' // user is not logged in
  | 'initial' // user has no sub
  | 'free' // user has no sub, but had before (trial ended / sub canceled)
  | 'pro'
  | 'pro+'
  | 'pro_max';

const LEVELS: Record<UserGroup, number> = {
  'guest': -2,
  'initial': -1,
  'free': 0,
  'pro': 1,
  'pro+': 2,
  'pro_max': 3,
};

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

  const status = subs?.status ?? 'canceled';

  const group: UserGroup = (() => {
    if (!isLoggedIn) return 'guest';
    if (isMiniApp) return 'pro_max';
    if (status === 'active' || status === 'trialing' || status === 'past_due') {
      if (level === 1) return 'pro';
      if (level === 2) return 'pro+';
      if (level === 3) return 'pro_max';
      return 'initial';
    }
    return 'free';
  })();

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
          let matchedLevel = Math.min(...neededGroups.map(g => LEVELS[g]));
          matchedLevel = matchedLevel < 1 ? 1 : matchedLevel;
          navigate(
            `/account/billing?level=${matchedLevel}${
              group === 'initial' ? '&paymentMethod=fiat' : ''
            }`,
          );
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
