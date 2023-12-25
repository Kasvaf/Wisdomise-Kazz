import { useEffect } from 'react';
import { useAccountQuery } from 'api';

export const useHubSpot = () => {
  const { data: account } = useAccountQuery();

  useEffect(() => {
    if (account?.email) {
      configHubSpot({
        email: account.email,
        token: account.hub_spot_token,
      });
    }
  }, [account?.email, account?.hub_spot_token]);
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
