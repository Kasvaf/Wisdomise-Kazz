export default function configHubSpot() {
  (window as any).hsConversationsOnReady = [
    () => {
      const { HubSpotConversations } = window as any;
      HubSpotConversations.on('widgetClosed', () => {
        document
          .querySelector('#hubspot-messages-iframe-container')
          ?.classList.remove('open');
      });
    },
  ];

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
