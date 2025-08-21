import { useAccountQuery } from 'api';
import { useIsLoggedIn } from 'modules/base/auth/jwt-store';
import { useEmbedView } from 'modules/embedded/useEmbedView';
import { useEffect } from 'react';

export const useHubSpot = () => {
  const isLoggedIn = useIsLoggedIn();
  const { data: account } = useAccountQuery();
  const { isEmbeddedView } = useEmbedView();

  useEffect(() => {
    if (account?.email && isLoggedIn && !isEmbeddedView) {
      configHubSpot({
        email: account.email,
        token: account.hub_spot_token,
      });
    }
  }, [account?.email, account?.hub_spot_token, isEmbeddedView, isLoggedIn]);
};

let loaded = false;
function configHubSpot({ email, token }: { email: string; token: string }) {
  if (loaded) return;
  loaded = true;

  Object.assign(window, {
    hsConversationsOnReady: [
      () => {
        const { HubSpotConversations } = window as any;
        HubSpotConversations.on('widgetClosed', () => {
          document
            .querySelector('#hubspot-messages-iframe-container')
            ?.classList.remove('open');
        });
      },
    ],
  });

  if (email && token) {
    Object.assign(window, {
      hsConversationsSettings: {
        identificationEmail: email,
        identificationToken: token,
      },
    });
  }

  const script = Object.assign(document.createElement('script'), {
    src: '//js-eu1.hs-scripts.com/143701415.js',
    type: 'text/javascript',
    id: 'hs-script-loader',
    async: true,
    defer: true,
  });
  document.body.append(script);
}

export function openHubSpot() {
  const { HubSpotConversations } = window as any;
  if (HubSpotConversations) {
    HubSpotConversations.widget.open();
    document
      .querySelector('#hubspot-messages-iframe-container')
      ?.classList.add('open');
  }
}
