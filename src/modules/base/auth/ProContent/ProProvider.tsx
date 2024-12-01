import {
  createContext,
  useContext,
  useMemo,
  type PropsWithChildren,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from 'api';
import { APP_PANEL } from 'config/constants';
import { useEmbedView } from 'modules/embedded/useEmbedView';
import { useModalLogin } from '../ModalLogin';
import { useIsLoggedIn } from '../jwt-store';
import { TrialStartedModal } from './TrialStartedModal';

interface ProContext {
  ensureHasLevel: (level: number) => Promise<boolean>;
}

const proContext = createContext<ProContext>({
  ensureHasLevel: () => {
    throw new Error('Pro Context not initialized yet');
  },
});

export const usePro = () => useContext(proContext);

export function ProProvider({
  children,
}: PropsWithChildren<{
  className?: string;
}>) {
  const isLoggedIn = useIsLoggedIn();
  const [ModalLogin, showModalLogin] = useModalLogin();
  const navigate = useNavigate();
  const subscription = useSubscription();
  const { isEmbeddedView } = useEmbedView();

  const value = useMemo<ProContext>(() => {
    return {
      ensureHasLevel: (level: number) => {
        return new Promise(resolve => {
          if (isEmbeddedView && top) {
            top.window.location.href = `${APP_PANEL}/account/billing`;
            // never resolve
          } else {
            if (!isLoggedIn) {
              return showModalLogin();
            }
            if (subscription.level < level) {
              navigate('/account/billing');
            } else {
              resolve(true);
            }
          }
        });
      },
    };
  }, [
    isEmbeddedView,
    isLoggedIn,
    navigate,
    showModalLogin,
    subscription.level,
  ]);

  return (
    <proContext.Provider value={value}>
      {children}
      <TrialStartedModal />
      {ModalLogin}
    </proContext.Provider>
  );
}
