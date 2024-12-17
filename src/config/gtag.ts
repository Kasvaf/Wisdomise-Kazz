// Google Tag Manager is already initiated inside index.html and no need to call config

export const gtag = (
  type: string,
  event: string,
  parameters: Record<string, string | number | boolean> = {},
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment, @typescript-eslint/prefer-ts-expect-error
  /* @ts-ignore */
) => window?.gtag?.(type, event, parameters);
