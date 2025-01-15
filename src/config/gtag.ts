// Google Tag Manager is already initiated inside index.html and no need to call config

export const gtag = (
  type: string,
  event: string,
  parameters: Record<string, string | number | boolean> = {},
) => {
  return window?.dataLayer?.push?.({
    [type]: event,
    method: 'Google',
    ...parameters,
  });
};
