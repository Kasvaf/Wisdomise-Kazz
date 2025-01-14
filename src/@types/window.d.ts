declare global {
  interface Window {
    dataLayer: any[];
    utmEnabled?: boolean;
  }
}

export {};
