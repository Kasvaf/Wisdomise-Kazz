let added = false;

export default function configTelegramMiniApp() {
  if (added) {
    return;
  }

  added = true;
  const script = document.createElement('script');
  script.id = 'TelegramMiniApp';
  script.async = true;
  script.type = 'text/javascript';
  script.src = 'https://telegram.org/js/telegram-web-app.js';
  document.head.append(script);
  console.log('he');
}
