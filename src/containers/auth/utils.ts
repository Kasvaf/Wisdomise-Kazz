import { GOOGLE_CAPTCHA_SITE_KEY } from 'config/keys';

export const fetchCaptchaToken = async (action: string): Promise<string> => {
  const grecaptcha = window.grecaptcha;
  return new Promise((resolve, reject) => {
    try {
      if (!grecaptcha) return resolve('');

      grecaptcha.enterprise.ready(() => {
        grecaptcha.enterprise
          .execute(GOOGLE_CAPTCHA_SITE_KEY, {
            action,
          })
          .then((token: string) => {
            return resolve(token);
          });
      });
    } catch (e) {
      return reject(e);
    }
  });
};
